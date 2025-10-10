package dao;

import config.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Projections;
import entity.ChatParticipant;
import entity.User;
import java.util.List;

public class ChatParticipantDAO extends GenericDAO<ChatParticipant, Long> {
    
    public ChatParticipantDAO() {
        super(ChatParticipant.class);
    }
    
    public ChatParticipant findByChatAndUser(Long chatId, Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(ChatParticipant.class)
                    .createAlias("chat", "c")
                    .createAlias("user", "u")
                    .add(Restrictions.eq("c.id", chatId))
                    .add(Restrictions.eq("u.id", userId));
                    
            return (ChatParticipant) criteria.uniqueResult();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<User> findUsersByChatId(Long chatId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            String hql = "SELECT cp.user FROM ChatParticipant cp " +
                        "WHERE cp.chat.id = :chatId " +
                        "ORDER BY cp.joinedAt ASC";
            
            List<User> users = session.createQuery(hql)
                    .setParameter("chatId", chatId)
                    .list();
                    
            return users;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<ChatParticipant> findByChatId(Long chatId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(ChatParticipant.class)
                    .createAlias("chat", "c")
                    .add(Restrictions.eq("c.id", chatId))
                    .addOrder(org.hibernate.criterion.Order.asc("joinedAt"));
                    
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
    
    public List<ChatParticipant> findByUserId(Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(ChatParticipant.class)
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
    
    public long countAdminsInChat(Long chatId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(ChatParticipant.class)
                    .createAlias("chat", "c")
                    .add(Restrictions.eq("c.id", chatId))
                    .add(Restrictions.eq("role", ChatParticipant.Role.ADMIN))
                    .setProjection(Projections.rowCount());
                    
            Long count = (Long) criteria.uniqueResult();
            return count != null ? count : 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public boolean isUserInChat(Long chatId, Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(ChatParticipant.class)
                    .createAlias("chat", "c")
                    .createAlias("user", "u")
                    .add(Restrictions.eq("c.id", chatId))
                    .add(Restrictions.eq("u.id", userId))
                    .setProjection(Projections.rowCount());
                    
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
    
    public void removeUserFromChat(Long chatId, Long userId) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            String hql = "DELETE FROM ChatParticipant cp " +
                        "WHERE cp.chat.id = :chatId AND cp.user.id = :userId";
            
            session.createQuery(hql)
                    .setParameter("chatId", chatId)
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
}