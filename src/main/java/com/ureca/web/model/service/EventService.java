package com.ureca.web.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ureca.web.model.StarException;
import com.ureca.web.model.dao.EventDao;
import com.ureca.web.model.dto.Event;

@Service
public class EventService {
	
	@Autowired
	EventDao eventDao;
	
	public List<Event> getEvents() throws StarException{
		try {
			return eventDao.getEvents();
		}catch(Exception e) {
			e.printStackTrace();
			throw new StarException("잠시 후 다시 시도해주세요");
		}
	}

}
