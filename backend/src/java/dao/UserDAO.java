package dao;

import config.HibernateUtil;
import entity.User;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Projections;
import java.util.List;

public class UserDAO {
    
    public boolean registerUser(User user) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            // Check if username exists using Criteria
            Long count = (Long) session.createCriteria(User.class)
                .add(Restrictions.eq("username", user.getUsername()))
                .setProjection(Projections.rowCount())
                .uniqueResult();
                
            if (count > 0) {
                return false; // Username exists
            }
            
            session.save(user);
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
    
    public User authenticateUser(String username, String password) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            User user = (User) session.createCriteria(User.class)
                .add(Restrictions.eq("username", username))
                .add(Restrictions.eq("password", password))
                .uniqueResult();
                
            return user;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public User getUserByUsername(String username) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            User user = (User) session.createCriteria(User.class)
                .add(Restrictions.eq("username", username))
                .uniqueResult();
                
            return user;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<User> getAllUsers() {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<User> users = session.createCriteria(User.class)
                .list();
                
            return users;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public User getUserById(int id) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            return (User) session.get(User.class, (long) id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    // Add missing methods
    public User findByEmail(String email) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            User user = (User) session.createCriteria(User.class)
                .add(Restrictions.eq("email", email))
                .uniqueResult();
                
            return user;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public User findByPhone(String phoneNumber) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            User user = (User) session.createCriteria(User.class)
                .add(Restrictions.eq("phoneNumber", phoneNumber))
                .uniqueResult();
                
            return user;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public void updateUser(User user) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            session.update(user);
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
    
    public List<User> searchUsers(String query) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<User> users = session.createCriteria(User.class)
                .add(Restrictions.or(
                    Restrictions.ilike("username", "%" + query + "%"),
                    Restrictions.ilike("displayName", "%" + query + "%"),
                    Restrictions.ilike("email", "%" + query + "%")
                ))
                .list();
                
            return users;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<User> findOnlineUsers() {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            @SuppressWarnings("unchecked")
            List<User> users = session.createCriteria(User.class)
                .add(Restrictions.eq("isOnline", true))
                .list();
                
            return users;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}