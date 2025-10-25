package com.ureca.web.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.ureca.web.model.dto.Menu;
import com.ureca.web.model.dto.MenuDetailDto;

@Mapper
public interface MenuDao {
	public List<Menu> getMenus();
	
	public MenuDetailDto selectMenuDetailWithOffers(int no);
}
