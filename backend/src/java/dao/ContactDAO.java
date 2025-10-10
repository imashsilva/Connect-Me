package dao;

import config.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import entity.Contact;
import java.util.List;

public class ContactDAO extends GenericDAO<Contact, Long> {
    
    public ContactDAO() {
        super(Contact.class);
    }
    
    public Contact findByUserAndContactUser(Long userId, Long contactUserId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(Contact.class)
                    .createAlias("user", "u")
                    .createAlias("contactUser", "cu")
                    .add(Restrictions.eq("u.id", userId))
                    .add(Restrictions.eq("cu.id", contactUserId));
                    
            return (Contact) criteria.uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<Contact> findByUserId(Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(Contact.class)
                    .createAlias("user", "u")
                    .add(Restrictions.eq("u.id", userId))
                    .addOrder(org.hibernate.criterion.Order.asc("contactName"));
                    
            return criteria.list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<Contact> findBlockedContactsByUserId(Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(Contact.class)
                    .createAlias("user", "u")
                    .add(Restrictions.eq("u.id", userId))
                    .add(Restrictions.eq("isBlocked", true));
                    
            return criteria.list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public boolean isContactExists(Long userId, Long contactUserId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(Contact.class)
                    .createAlias("user", "u")
                    .createAlias("contactUser", "cu")
                    .add(Restrictions.eq("u.id", userId))
                    .add(Restrictions.eq("cu.id", contactUserId))
                    .setProjection(org.hibernate.criterion.Projections.rowCount());
                    
            Long count = (Long) criteria.uniqueResult();
            return count != null && count > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public void removeContact(Long userId, Long contactUserId) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            String hql = "DELETE FROM Contact c " +
                        "WHERE c.user.id = :userId " +
                        "AND c.contactUser.id = :contactUserId";
            
            session.createQuery(hql)
                    .setParameter("userId", userId)
                    .setParameter("contactUserId", contactUserId)
                    .executeUpdate();
                    
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<Contact> searchContacts(Long userId, String query) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(Contact.class)
                    .createAlias("user", "u")
                    .createAlias("contactUser", "cu")
                    .add(Restrictions.eq("u.id", userId))
                    .add(Restrictions.or(
                        Restrictions.ilike("contactName", "%" + query + "%"),
                        Restrictions.ilike("cu.username", "%" + query + "%"),
                        Restrictions.ilike("cu.displayName", "%" + query + "%")
                    ))
                    .addOrder(org.hibernate.criterion.Order.asc("contactName"));
                    
            return criteria.list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
}