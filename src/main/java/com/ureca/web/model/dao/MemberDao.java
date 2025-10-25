package com.ureca.web.model.dao;

import org.apache.ibatis.annotations.Mapper;
import com.ureca.web.model.dto.Member;

@Mapper
public interface MemberDao {

	public void registerMember(Member member)  ;

	public Member staridLogin(Member m);
}