package dao;

import config.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Projections;
import entity.Chat;
import java.util.List;

public class ChatDAO extends GenericDAO<Chat, Long> {
    
    public ChatDAO() {
        super(Chat.class);
    }
    
    public Chat findIndividualChat(Long user1Id, Long user2Id) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            // Find chats where both users are participants
            String hql = "SELECT c FROM Chat c " +
                        "WHERE c.chatType = 'INDIVIDUAL' " +
                        "AND c.id IN (" +
                        "    SELECT cp1.chat.id FROM ChatParticipant cp1 WHERE cp1.user.id = :user1Id" +
                        ") " +
                        "AND c.id IN (" +
                        "    SELECT cp2.chat.id FROM ChatParticipant cp2 WHERE cp2.user.id = :user2Id" +
                        ")";
            
            Chat chat = (Chat) session.createQuery(hql)
                    .setParameter("user1Id", user1Id)
                    .setParameter("user2Id", user2Id)
                    .setMaxResults(1)
                    .uniqueResult();
                    
            return chat;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<Chat> findChatsByUserId(Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            String hql = "SELECT DISTINCT c FROM Chat c " +
                        "JOIN c.participants cp " +
                        "WHERE cp.user.id = :userId " +
                        "ORDER BY c.lastMessageAt DESC";
            
            List<Chat> chats = session.createQuery(hql)
                    .setParameter("userId", userId)
                    .list();
                    
            return chats;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
    
    public List<Chat> findGroupChatsByUserId(Long userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(Chat.class)
                    .createAlias("participants", "cp")
                    .add(Restrictions.eq("cp.user.id", userId))
                    .add(Restrictions.eq("chatType", Chat.ChatType.GROUP))
                    .addOrder(org.hibernate.criterion.Order.desc("lastMessageAt"));
                    
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
    
    public int getParticipantCount(Long chatId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(Chat.class)
                    .createAlias("participants", "cp")
                    .add(Restrictions.eq("id", chatId))
                    .setProjection(Projections.rowCount());
                    
            Long count = (Long) criteria.uniqueResult();
            return count != null ? count.intValue() : 0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
}