package com.ureca.web.model.dao;

import org.apache.ibatis.annotations.Mapper;

import com.ureca.web.model.dto.SaltInfo;

@Mapper
public interface SaltDao {
	
	public void insertSalt(SaltInfo saltInfo);
	
	public SaltInfo selectSalt(String id);

}
