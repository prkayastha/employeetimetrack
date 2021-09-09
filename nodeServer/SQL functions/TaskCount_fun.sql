CREATE FUNCTION `taskCount`(id int) RETURNS int
    DETERMINISTIC
BEGIN
	DECLARE taskCount int default 0;
    
    SELECT count(*) into taskCount from Tasks where projectId = id;
    RETURN taskCount;
END