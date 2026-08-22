package com.whatthemic.backend.controller;

import com.whatthemic.backend.entity.TicketBooking;
import com.whatthemic.backend.entity.TicketType;
import com.whatthemic.backend.repository.TicketBookingRepository;
import com.whatthemic.backend.repository.TicketTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicBookingController {

    @Autowired
    private TicketBookingRepository ticketBookingRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @PostMapping
    public TicketBooking bookTicket(@RequestBody TicketBooking booking) {
        if (booking.getTicketType() != null && booking.getTicketType().getId() != null) {
            TicketType type = ticketTypeRepository.findById(booking.getTicketType().getId()).orElseThrow();
            
            if (type.getAvailableSeats() < booking.getQuantity()) {
                throw new RuntimeException("Not enough seats available");
            }

            type.setAvailableSeats(type.getAvailableSeats() - booking.getQuantity());
            ticketTypeRepository.save(type);
        }

        if (booking.getStatus() == null) {
            booking.setStatus("PENDING_APPROVAL");
        }

        if (booking.getBookingTime() == null) {
            booking.setBookingTime(java.time.LocalDateTime.now());
        }

        if (booking.getQuantity() == null) {
            booking.setQuantity(1);
        }

        return ticketBookingRepository.save(booking);
    }
}
