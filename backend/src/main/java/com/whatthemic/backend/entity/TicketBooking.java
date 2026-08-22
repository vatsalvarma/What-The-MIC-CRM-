package com.whatthemic.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerPhone;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = true)
    private Integer quantity = 1;

    @Column(columnDefinition = "LONGTEXT")
    private String paymentScreenshotUrl;

    @Column(nullable = false)
    private String status = "PENDING_APPROVAL";

    @Column(nullable = false)
    private LocalDateTime bookingTime = LocalDateTime.now();
}
