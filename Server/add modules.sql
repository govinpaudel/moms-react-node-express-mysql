insert into user_modules(user_id,office_id,module_id,isactive)(SELECT DISTINCT
	users.id as user_id, 
	users.office_id, 
	modules.id as module_id,
	1 as isactive
FROM
	users,
modules where modules.id in(1,4,5,7))