package config;

import controller.*;
import filter.AuthFilter;
import filter.CORSFilter;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletRegistration;
import javax.servlet.FilterRegistration;
import javax.servlet.annotation.WebListener;

@WebListener
public class ServletInitializer implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext servletContext = sce.getServletContext();

        System.out.println("🚀 Initializing ConnectMe Backend...");

        // Register Servlets
        registerServlets(servletContext);

        // Register Filters
        registerFilters(servletContext);

        // Initialize Hibernate
        initializeHibernate();

        System.out.println("✅ ConnectMe Backend initialized successfully!");
    }

    private void registerServlets(ServletContext servletContext) {
        ServletRegistration.Dynamic authServlet = servletContext.addServlet("AuthServlet", AuthServlet.class);
        authServlet.addMapping("/api/auth/*");
        authServlet.setLoadOnStartup(1);

        ServletRegistration.Dynamic userServlet = servletContext.addServlet("UserServlet", UserServlet.class);
        userServlet.addMapping("/api/users/*");
        userServlet.setLoadOnStartup(1);

        ServletRegistration.Dynamic chatServlet = servletContext.addServlet("ChatServlet", ChatServlet.class);
        chatServlet.addMapping("/api/chats/*");
        chatServlet.setLoadOnStartup(1);

        ServletRegistration.Dynamic messageServlet = servletContext.addServlet("MessageServlet", MessageServlet.class);
        messageServlet.addMapping("/api/messages/*");
        messageServlet.setLoadOnStartup(1);

        ServletRegistration.Dynamic contactServlet = servletContext.addServlet("ContactServlet", ContactServlet.class);
        contactServlet.addMapping("/api/contacts/*");
        contactServlet.setLoadOnStartup(1);

        ServletRegistration.Dynamic uploadServlet = servletContext.addServlet("UploadServlet", UploadServlet.class);
        uploadServlet.addMapping("/api/upload/*");
        uploadServlet.setLoadOnStartup(1);

        ServletRegistration.Dynamic healthServlet = servletContext.addServlet("HealthServlet", HealthServlet.class);
        healthServlet.addMapping("/api/health");
        healthServlet.setLoadOnStartup(1);
    }

    private void registerFilters(ServletContext servletContext) {
        // CORS Filter - should be first
        FilterRegistration.Dynamic corsFilter = servletContext.addFilter("CorsFilter", CORSFilter.class);
        corsFilter.addMappingForUrlPatterns(null, false, "/*");

        // Auth Filter - after CORS
        FilterRegistration.Dynamic authFilter = servletContext.addFilter("AuthFilter", AuthFilter.class);
        authFilter.addMappingForUrlPatterns(null, false, "/api/*");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        HibernateUtil.shutdown();
        System.out.println("🔴 ConnectMe Backend shut down.");
    }

    private void initializeHibernate() {
        try {
            // Test Hibernate initialization
            if (HibernateUtil.isInitialized()) {
                System.out.println("✅ Hibernate initialized successfully!");
            } else {
                System.err.println("⚠️ Hibernate initialization failed, but continuing deployment...");
                System.err.println("⚠️ Some features may not work until Hibernate is fixed.");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Hibernate check failed: " + e.getMessage());
            // Don't rethrow - allow deployment to continue
        }
    }
}
