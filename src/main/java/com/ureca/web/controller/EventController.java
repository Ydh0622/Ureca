package com.ureca.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ureca.web.model.StarException;
import com.ureca.web.model.dto.Event;
import com.ureca.web.model.service.EventService;

@RestController
public class EventController {
	
	@Autowired
	EventService eventService;
	
	@GetMapping("/getEvents")
	public List<Event> getEvents(){
		try {
			return eventService.getEvents();
		} catch (StarException e) {
			return null;
		}
	}

}
