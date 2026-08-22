package com.whatthemic.backend.controller;

import com.whatthemic.backend.entity.Event;
import com.whatthemic.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
public class AdminEventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByIdDesc();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setName(eventDetails.getName());
        event.setVenue(eventDetails.getVenue());
        event.setEventDate(eventDetails.getEventDate());
        event.setDescription(eventDetails.getDescription());
        event.setBannerUrl(eventDetails.getBannerUrl());
        event.setGalleryUrls(eventDetails.getGalleryUrls());
        event.setClosed(eventDetails.getClosed());
        event.setPrice(eventDetails.getPrice());
        event.setCat(eventDetails.getCat());
        event.setColor(eventDetails.getColor());
        return eventRepository.save(event);
    }

    @PutMapping("/{id}/complete")
    public Event completeEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setClosed(true);
        return eventRepository.save(event);
    }

    @Autowired
    private com.whatthemic.backend.repository.ArtistLeadRepository artistLeadRepository;

    @Autowired
    private com.whatthemic.backend.repository.TicketBookingRepository ticketBookingRepository;

    @Autowired
    private com.whatthemic.backend.repository.TicketTypeRepository ticketTypeRepository;

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public void deleteEvent(@PathVariable Long id) {
        artistLeadRepository.deleteByEventId(id);
        ticketBookingRepository.deleteByEventId(id);
        ticketTypeRepository.deleteByEventId(id);
        eventRepository.deleteById(id);
    }
}
