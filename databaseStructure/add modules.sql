truncate table voucher_user_modules;
insert into voucher_user_modules(user_id,office_id,module_id,isactive)(SELECT DISTINCT
	voucher_users.id as user_id, 
	voucher_users.office_id, 
	voucher_modules.id as module_id,
	1 as isactive
FROM
	voucher_users,
voucher_modules);