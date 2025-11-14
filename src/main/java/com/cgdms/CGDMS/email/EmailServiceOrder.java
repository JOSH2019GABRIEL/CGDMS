package com.cgdms.CGDMS.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Slf4j
@Service
public class EmailServiceOrder {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    /**
     * Send a generic email with Thymeleaf template and dynamic properties.
     *
     * @param to Recipient email address
     * @param subject Email subject line
     * @param templateName Name of the Thymeleaf template (without .html extension)
     * @param variables Map of dynamic variables to be replaced in the template
     */
    @Async
    public void sendEmail(
            String to,
            String subject,
            String templateName,
            Map<String, Object> variables
    ) throws MessagingException, UnsupportedEncodingException {

        log.info("Preparing to send email to: {} using template: {}", to, templateName);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );

        Context context = new Context();
        context.setVariables(variables);

        String htmlContent = templateEngine.process(templateName, context);

        helper.setFrom("noreply@cgdms.com", "CGDMS Notification");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);

        log.info("Email sent successfully to {}", to);
    }

    /**
     * Helper method for quick single-purpose emails.
     */
    @Async
    public void sendSimpleEmail(String to, String subject, String messageBody) throws MessagingException, UnsupportedEncodingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );

        helper.setFrom("noreply@cgdms.com", "CGDMS Notification");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(messageBody, true);

        mailSender.send(mimeMessage);
    }
}