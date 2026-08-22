package com.whatthemic.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "artist_leads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistLead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = true)
    private Event event;

    // Form 1 Details
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer age;

    @Column(columnDefinition = "LONGTEXT")
    private String paymentScreenshotUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadStatus status = LeadStatus.PENDING_APPROVAL;

    // Form 2 Details
    @Column
    private String instagramLink;

    @Column
    private String performanceTrack;

    @Column(columnDefinition = "TEXT")
    private String selfIntro;

    @Column(columnDefinition = "LONGTEXT")
    private String audioTrackUrl;

    @Column
    private Integer lineupOrder; // Used by host to reorder
}
