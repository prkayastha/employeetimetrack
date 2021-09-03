CREATE DEFINER=`root`@`localhost` FUNCTION `duration`(iTaskId int, iUserId int) RETURNS time
    DETERMINISTIC
BEGIN
DECLARE timeDuration time;
DECLARE startDateWeek datetime;
Declare endDateWeek datetime;

SELECT DATE_ADD(curdate(), INTERVAL(-WEEKDAY(curdate())) DAY) into startDateWeek;

SELECT DATE_ADD(curdate(), INTERVAL(6-WEEKDAY(curdate())) DAY) into endDateWeek;

SELECT 
    SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(`endedAt`, `startedAt`))))
INTO timeDuration FROM
    user_management.timers
WHERE
    userId = iUserId AND taskId = iTaskId AND startedAt between startDateWeek and endDateWeek;
    
IF timeDuration is null Then
	set timeDuration = 0;
end if;
    return timeDuration;
END