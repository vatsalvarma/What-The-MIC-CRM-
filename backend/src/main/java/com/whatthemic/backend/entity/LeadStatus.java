package com.whatthemic.backend.entity;

public enum LeadStatus {
    PENDING_APPROVAL, // Form 1 submitted
    APPROVED,         // Form 2 link sent
    STAGE_READY,      // Form 2 complete
    ON_SPOT,          // Registered at venue
    REJECTED          // Lead rejected by admin
}
