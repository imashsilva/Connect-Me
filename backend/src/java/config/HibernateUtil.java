package config;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

public class HibernateUtil {
    
    private static SessionFactory sessionFactory;
    
    static {
        try {
            System.out.println("🚀 Starting Hibernate initialization...");
            
            // Create configuration
            Configuration configuration = new Configuration();
            
            // Explicitly set properties to avoid any cache issues
            configuration.setProperty("hibernate.cache.use_second_level_cache", "false");
            configuration.setProperty("hibernate.cache.use_query_cache", "false");
            configuration.setProperty("hibernate.cache.region.factory_class", "org.hibernate.cache.internal.NoCachingRegionFactory");
            configuration.setProperty("hibernate.max_fetch_depth", "1");
            
            // Configure from XML
            configuration.configure("hibernate.cfg.xml");
            
            System.out.println("📋 Configuration loaded, building SessionFactory...");
            
            // Build session factory
            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                .applySettings(configuration.getProperties())
                .build();
            
            sessionFactory = configuration.buildSessionFactory(serviceRegistry);
            
            System.out.println("✅ Hibernate initialized successfully!");
            
        } catch (Throwable ex) {
            System.err.println("❌ Hibernate initialization FAILED: " + ex.getMessage());
            System.err.println("❌ Exception type: " + ex.getClass().getName());
            ex.printStackTrace();
            sessionFactory = null;
        }
    }
    
    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
    
    public static boolean isInitialized() {
        return sessionFactory != null;
    }
    
    public static void shutdown() {
        if (sessionFactory != null) {
            sessionFactory.close();
            System.out.println("🔴 Hibernate shut down.");
        }
    }
}