package com.ureca.web.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ureca.web.model.StarException;
import com.ureca.web.model.dao.MenuDao;
import com.ureca.web.model.dto.Menu;
import com.ureca.web.model.dto.MenuDetailDto;

@Service
public class MenuService {

	@Autowired
	MenuDao menuDao;

	public List<Menu> getMenus() throws StarException{
		try {
			return menuDao.getMenus();
		}catch(Exception e) {
			e.printStackTrace();
			throw new StarException("잠시 후 다시 시도해주세요");
		}
	}

	public MenuDetailDto getMenuDetail(int no) {
		return menuDao.selectMenuDetailWithOffers(no);
	}
}
