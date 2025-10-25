package com.ureca.web.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ureca.web.model.dto.Event;

@Mapper
public interface EventDao {
	
	public List<Event> getEvents();

}