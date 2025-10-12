package dao;

import config.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import entity.MessageStatus;
import java.util.List;

public class MessageStatusDAO extends GenericDAO<MessageStatus, Long> {
    
    public MessageStatusDAO() {
        super(MessageStatus.class);
    }
    
    public MessageStatus findByMessageAndUser(Long messageId, Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(MessageStatus.class)
                    .createAlias("message", "m")
                    .createAlias("user", "u")
                    .add(Restrictions.eq("m.id", messageId))
                    .add(Restrictions.eq("u.id", userId));
                    
            return (MessageStatus) criteria.uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<MessageStatus> findByMessageId(Long messageId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(MessageStatus.class)
                    .createAlias("message", "m")
                    .add(Restrictions.eq("m.id", messageId));
                    
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
    
    public List<MessageStatus> findByUserId(Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(MessageStatus.class)
                    .createAlias("user", "u")
                    .add(Restrictions.eq("u.id", userId));
                    
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
    
    public void updateStatusForMessageAndUser(Long messageId, Long userId, MessageStatus.Status status) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            MessageStatus messageStatus = findByMessageAndUser(messageId, userId);
            if (messageStatus != null) {
                messageStatus.setStatus(status);
                session.update(messageStatus);
            }
            
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
    
    public void markAllAsDeliveredForUser(Long userId) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            String hql = "UPDATE MessageStatus ms " +
                        "SET ms.status = 'DELIVERED' " +
                        "WHERE ms.user.id = :userId " +
                        "AND ms.status = 'SENT'";
            
            session.createQuery(hql)
                    .setParameter("userId", userId)
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
    
    public void deleteByMessageId(Long messageId) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            String hql = "DELETE FROM MessageStatus ms WHERE ms.message.id = :messageId";
            session.createQuery(hql)
                    .setParameter("messageId", messageId)
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
}