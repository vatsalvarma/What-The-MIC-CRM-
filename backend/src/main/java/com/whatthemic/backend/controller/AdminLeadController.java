package com.whatthemic.backend.controller;

import com.whatthemic.backend.entity.ArtistLead;
import com.whatthemic.backend.entity.LeadStatus;
import com.whatthemic.backend.entity.Role;
import com.whatthemic.backend.entity.User;
import com.whatthemic.backend.repository.ArtistLeadRepository;
import com.whatthemic.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import org.springframework.data.domain.Sort;
import java.util.List;

@RestController
@RequestMapping("/api/admin/leads")
public class AdminLeadController {

    @Autowired
    private ArtistLeadRepository artistLeadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<ArtistLead> getAllLeads() {
        return artistLeadRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PutMapping("/{id}/status")
    public ArtistLead updateLeadStatus(@PathVariable Long id, @RequestParam LeadStatus status) {
        ArtistLead lead = artistLeadRepository.findById(id).orElseThrow();
        lead.setStatus(status);
        if (status == LeadStatus.APPROVED) {
            // Mocking WhatsApp message here
            System.out.println("Mock WhatsApp: Hey " + lead.getName() + ", you are approved! Fill Form 2 here: http://localhost:5173/form2/" + lead.getId());
        }
        return artistLeadRepository.save(lead);
    }

    @PostMapping("/onspot")
    public ArtistLead createOnSpotLead(@RequestBody ArtistLead lead) {
        lead.setStatus(LeadStatus.ON_SPOT);
        // We might want to assign the max lineup order here
        return artistLeadRepository.save(lead);
    }

    @PutMapping("/host/password")
    public Map<String, String> resetHostPassword(@RequestBody Map<String, String> body) {
        String newPass = body.get("password");
        User host = userRepository.findByUsername("host").orElse(null);
        if (host == null) {
            host = new User();
            host.setUsername("host");
            host.setRole(Role.ROLE_HOST);
        }
        host.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(host);
        return Map.of("success", "true");
    }
}
