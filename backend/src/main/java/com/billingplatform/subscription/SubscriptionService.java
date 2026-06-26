package com.billingplatform.subscription;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEventRepository eventRepository;

    public Page<Subscription> getSubscriptions(String status, String customerId, String search, Pageable pageable) {
        Subscription.SubscriptionStatus subStatus = (status != null && !status.trim().isEmpty()) ? Subscription.SubscriptionStatus.valueOf(status.toUpperCase()) : null;
        return subscriptionRepository.findAllWithFilters(subStatus, customerId, search, pageable);
    }

    public Subscription getSubscription(String id) {
        return subscriptionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }

    @Transactional
    public Subscription createSubscription(Subscription subscription) {
        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        subscription.setCurrentTermStart(LocalDateTime.now());
        subscription.setCurrentTermEnd(LocalDateTime.now().plusMonths(1));
        subscription.setNextBillingAt(subscription.getCurrentTermEnd());
        
        Subscription saved = subscriptionRepository.save(subscription);
        
        logEvent(saved, "CREATED", "{\"note\": \"Subscription created via API\"}");
        return saved;
    }

    @Transactional
    public Subscription pauseSubscription(String id) {
        Subscription sub = getSubscription(id);
        if (sub.getStatus() == Subscription.SubscriptionStatus.ACTIVE) {
            sub.setStatus(Subscription.SubscriptionStatus.PAUSED);
            subscriptionRepository.save(sub);
            logEvent(sub, "PAUSED", "{\"note\": \"Subscription paused\"}");
        }
        return sub;
    }

    @Transactional
    public Subscription resumeSubscription(String id) {
        Subscription sub = getSubscription(id);
        if (sub.getStatus() == Subscription.SubscriptionStatus.PAUSED) {
            sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscriptionRepository.save(sub);
            logEvent(sub, "RESUMED", "{\"note\": \"Subscription resumed\"}");
        }
        return sub;
    }

    @Transactional
    public Subscription cancelSubscription(String id) {
        Subscription sub = getSubscription(id);
        if (sub.getStatus() != Subscription.SubscriptionStatus.CANCELLED) {
            sub.setStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(sub);
            logEvent(sub, "CANCELLED", "{\"note\": \"Subscription cancelled immediately\"}");
        }
        return sub;
    }

    @Transactional
    public Subscription reactivateSubscription(String id) {
        Subscription sub = getSubscription(id);
        if (sub.getStatus() == Subscription.SubscriptionStatus.CANCELLED) {
            sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscriptionRepository.save(sub);
            logEvent(sub, "REACTIVATED", "{\"note\": \"Subscription reactivated from cancellation\"}");
        }
        return sub;
    }

    public List<SubscriptionEvent> getEvents(String id) {
        return eventRepository.findBySubscriptionIdOrderByEventDateDesc(id);
    }

    private void logEvent(Subscription sub, String type, String details) {
        SubscriptionEvent event = new SubscriptionEvent();
        event.setSubscription(sub);
        event.setEventType(type);
        event.setDetails(details);
        eventRepository.save(event);
    }
}
