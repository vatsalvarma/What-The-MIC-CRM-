package com.whatthemic.backend.controller;

import com.whatthemic.backend.entity.Event;
import com.whatthemic.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/events")
public class PublicEventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByClosedFalseOrderByIdDesc();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }
}
