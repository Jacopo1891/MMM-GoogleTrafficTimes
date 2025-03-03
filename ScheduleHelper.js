class ScheduleHelper {
  static isScheduledNow(debug, name, schedules) {
    var check = false;
      if (!schedules || schedules.length === 0){
        check = true; 
        if (debug) console.log(`Module MMM-GoogleTrafficTimes: ${name} schedule empty -> ${check}`);
        return check;
      } 
        

      return schedules.some(schedule => {
          const now = new Date();
          const currentMinutes = this.toMinutes(now.getHours(), now.getMinutes());
    
          if (Array.isArray(schedule.days) && schedule.days.length > 0) {
            const currentDay = now.getDay();
            if (!schedule.days.includes(currentDay)) {
              if (debug) console.log(`Module MMM-GoogleTrafficTimes: ${name} today ${currentDay} not included -> ${check}`);
              return check;
            }
          }
    
          const startMinutes = this.toMinutes(schedule.startHH, schedule.startMM);
          const endMinutes = this.toMinutes(schedule.endHH, schedule.endMM);
    
          if (startMinutes !== null && endMinutes !== null) {
            check = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
          } else if (startMinutes !== null) {
            check = currentMinutes >= startMinutes;
          } else if (endMinutes !== null) {
            check = currentMinutes <= endMinutes;
          }
          if (debug) console.log(`Module MMM-GoogleTrafficTimes: ${name} check interval time -> ${check}`);
          return check;
        });
  }

  static toMinutes(hh, mm) {
  if (hh == null || hh === '' || mm == null || mm === '') {
    return null;
  }
  return parseInt(hh, 10) * 60 + parseInt(mm, 10);
}

  static isDestinationToCalculate(debug, destination){
    var check = false;
      if(!check) check = this.isScheduledNow(debug, destination.name, destination.schedules) || !!destination.showDestinationOutsideScheduleWithoutTraffic;
      if (debug) console.log(`Module MMM-GoogleTrafficTimes: isDestinationToCalculate -> ${destination.name} ${check}`);
      return check;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = ScheduleHelper;
} else if (typeof window !== 'undefined') {
  // Browser environment
  window.ScheduleHelper = ScheduleHelper;
}