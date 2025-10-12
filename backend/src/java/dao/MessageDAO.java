package dao;

import config.HibernateUtil;
import entity.Message;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import java.util.List;

public class MessageDAO {
    
    public boolean sendMessage(Message message) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            session.save(message);
            transaction.commit();
            return true;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return false;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Message> getMessagesBetweenUsers(int user1, int user2) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<Message> messages = session.createCriteria(Message.class)
                .createAlias("sender", "s")
                .createAlias("chat", "c")
                .createAlias("c.participants", "p")
                .add(Restrictions.or(
                    Restrictions.and(
                        Restrictions.eq("s.id", (long) user1),
                        Restrictions.eq("p.user.id", (long) user2)
                    ),
                    Restrictions.and(
                        Restrictions.eq("s.id", (long) user2),
                        Restrictions.eq("p.user.id", (long) user1)
                    )
                ))
                .addOrder(Order.asc("createdAt"))
                .list();
                
            return messages;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Message> getMessagesForUser(int userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<Message> messages = session.createCriteria(Message.class)
                .createAlias("chat", "c")
                .createAlias("c.participants", "p")
                .add(Restrictions.eq("p.user.id", (long) userId))
                .addOrder(Order.asc("createdAt"))
                .list();
                
            return messages;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Message> getMessagesForChat(Long chatId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<Message> messages = session.createCriteria(Message.class)
                .createAlias("chat", "c")
                .add(Restrictions.eq("c.id", chatId))
                .addOrder(Order.asc("createdAt"))
                .list();
                
            return messages;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public Message findById(Long messageId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            return (Message) session.get(Message.class, messageId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public void update(Message message) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            session.update(message);
            transaction.commit();
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public void delete(Message message) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            session.delete(message);
            transaction.commit();
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Message> findByChatId(Long chatId, int limit, int offset) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<Message> messages = session.createCriteria(Message.class)
                .createAlias("chat", "c")
                .add(Restrictions.eq("c.id", chatId))
                .addOrder(Order.desc("createdAt"))
                .setFirstResult(offset)
                .setMaxResults(limit)
                .list();
                
            return messages;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public Message findLastMessageByChatId(Long chatId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<Message> messages = session.createCriteria(Message.class)
                .createAlias("chat", "c")
                .add(Restrictions.eq("c.id", chatId))
                .addOrder(Order.desc("createdAt"))
                .setMaxResults(1)
                .list();
                
            return messages != null && !messages.isEmpty() ? messages.get(0) : null;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Message> findUnreadMessagesByChatAndUser(Long chatId, Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            // This is a simplified implementation
            // In a real app, you'd join with message_status table
            @SuppressWarnings("unchecked")
            List<Message> messages = session.createCriteria(Message.class)
                .createAlias("chat", "c")
                .add(Restrictions.eq("c.id", chatId))
                .add(Restrictions.ne("sender.id", userId))
                .addOrder(Order.asc("createdAt"))
                .list();
                
            return messages;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Message> searchMessages(Long chatId, String query) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<Message> messages = session.createCriteria(Message.class)
                .createAlias("chat", "c")
                .add(Restrictions.eq("c.id", chatId))
                .add(Restrictions.ilike("content", "%" + query + "%"))
                .addOrder(Order.desc("createdAt"))
                .list();
                
            return messages;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public Long save(Message message) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            Long id = (Long) session.save(message);
            transaction.commit();
            return id;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}