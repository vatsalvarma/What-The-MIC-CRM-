package com.whatthemic.backend.controller;

import com.whatthemic.backend.entity.TicketBooking;
import com.whatthemic.backend.repository.TicketBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBookingController {

    @Autowired
    private TicketBookingRepository ticketBookingRepository;

    @GetMapping
    public List<TicketBooking> getAllBookings() {
        return ticketBookingRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public TicketBooking updateStatus(@PathVariable Long id, @RequestParam String status) {
        TicketBooking booking = ticketBookingRepository.findById(id).orElseThrow();
        booking.setStatus(status);
        return ticketBookingRepository.save(booking);
    }
}
