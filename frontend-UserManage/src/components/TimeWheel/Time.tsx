import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

interface TimeWheelPickerProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  selectedDate?: string; 
}

export default function TimeWheelPicker({
  value,
  onChange = (timeString: string) => {}, 
  label = "",
  placeholder = "เลือกเวลา",
  selectedDate,
}: TimeWheelPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate hours (0-23) and minutes (0, 15, 30, 45)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    return {
      hour: now.getHours(),
      minute: now.getMinutes()
    };
  };

  // Check if the selected date is today
  const isToday = () => {
    if (!selectedDate) return true; 
    
    const today = new Date();
    const compareDate = typeof selectedDate === 'string' 
      ? new Date(selectedDate) 
      : selectedDate;
      
    return today.toDateString() === compareDate.toDateString();
  };

  // Check if selected time is valid (not before current time for today only)
  const isTimeValid = (hour: number, minute: number) => {
    if (!isToday()) {
      return true; 
    }
    
    const current = getCurrentTime();
    const selectedTimeInMinutes = hour * 60 + minute;
    const currentTimeInMinutes = current.hour * 60 + current.minute;
    
    return selectedTimeInMinutes > currentTimeInMinutes; 
  };

  // Get next valid time for today
  const getValidTimeForToday = () => {
    const current = getCurrentTime();
    const currentHour = current.hour;
    const currentMinute = current.minute;
    

    const nextValidMinute = minutes.find(min => min > currentMinute);
    
    if (nextValidMinute !== undefined) {

      return {
        hour: currentHour,
        minute: nextValidMinute
      };
    } else {
 
      return {
        hour: currentHour + 1 <= 23 ? currentHour + 1 : 23,
        minute: 0
      };
    }
  };

  // Get next valid minute for current hour
  const getNextValidMinute = (hour: number, currentMinute: number) => {
    if (!isToday()) {
      return currentMinute; 
    }
    
    const current = getCurrentTime();
    
    if (hour > current.hour) {

      return currentMinute;
    } else if (hour === current.hour) {
      const validMinutes = minutes.filter(min => min > current.minute);
      if (validMinutes.length > 0) {

        return validMinutes.find(min => min >= currentMinute) || validMinutes[0];
      } else {

        return 0;
      }
    }
    return currentMinute;
  };

  // Get next valid hour
  const getNextValidHour = (currentHour: number) => {
    if (!isToday()) {
      return currentHour; 
    }
    
    const current = getCurrentTime();
    return Math.max(currentHour, current.hour);
  };

  // Initialize from value or set to valid current time
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      

      if (isTimeValid(hour, minute)) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
      } else {

        const validHour = getNextValidHour(hour);
        const validMinute = getNextValidMinute(validHour, minute);
        setSelectedHour(validHour);
        setSelectedMinute(validMinute);

        const validTimeString = `${validHour.toString().padStart(2, '0')}:${validMinute.toString().padStart(2, '0')}`;
        onChange?.(validTimeString);
      }
    } else if (isToday()) {
      const validTime = getValidTimeForToday();
      setSelectedHour(validTime.hour);
      setSelectedMinute(validTime.minute);
      
      const validTimeString = `${validTime.hour.toString().padStart(2, '0')}:${validTime.minute.toString().padStart(2, '0')}`;
      onChange?.(validTimeString);
    } else {
      setSelectedHour(9);
      setSelectedMinute(0);
      
      onChange?.('09:00');
    }
  }, [value, selectedDate]); 

  // Handle time change
  const handleTimeChange = (hour: number, minute: number) => {
    if (!isTimeValid(hour, minute)) {
      return; 
    }
    
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  // Format display time
  const formatDisplayTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} น.`;
  };

  // Handle hour scroll
  const handleHourScroll = (direction: 'up' | 'down') => {
    if (!isToday()) {
      const newHour = direction === 'up' 
        ? (selectedHour === 0 ? 23 : selectedHour - 1)
        : (selectedHour === 23 ? 0 : selectedHour + 1);
      
      setSelectedHour(newHour);
      handleTimeChange(newHour, selectedMinute);
      return;
    }

    const current = getCurrentTime();
    let newHour;
    
    if (direction === 'up') {
      newHour = selectedHour === 0 ? 23 : selectedHour - 1;
      if (newHour < current.hour) {
        return;
      }
    } else {
      newHour = selectedHour === 23 ? 0 : selectedHour + 1;
      if (newHour < current.hour) {
        return;
      }
    }
    
    let newMinute = selectedMinute;
    if (newHour === current.hour) {
      newMinute = getNextValidMinute(newHour, selectedMinute);
    }
    
    if (isTimeValid(newHour, newMinute)) {
      setSelectedHour(newHour);
      setSelectedMinute(newMinute);
      handleTimeChange(newHour, newMinute);
    }
  };

  // Handle minute scroll
  const handleMinuteScroll = (direction: 'up' | 'down') => {
    const currentIndex = minutes.indexOf(selectedMinute);
    let newIndex;
    
    if (direction === 'up') {
      newIndex = currentIndex === 0 ? minutes.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === minutes.length - 1 ? 0 : currentIndex + 1;
    }
    
    const newMinute = minutes[newIndex];
    
    if (!isToday()) {
      setSelectedMinute(newMinute);
      handleTimeChange(selectedHour, newMinute);
      return;
    }
    
    const current = getCurrentTime();
    if (selectedHour === current.hour && newMinute <= current.minute) {
      return; 
    }
    
    if (isTimeValid(selectedHour, newMinute)) {
      setSelectedMinute(newMinute);
      handleTimeChange(selectedHour, newMinute);
    }
  };

  useEffect(() => {
    const hourElement = hourRef.current;
    const minuteElement = minuteRef.current;

    if (!hourElement || !minuteElement || !isOpen) return;

    const handleHourWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleHourScroll(direction);
    };

    const handleMinuteWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleMinuteScroll(direction);
    };

    hourElement.addEventListener('wheel', handleHourWheel, { passive: false });
    minuteElement.addEventListener('wheel', handleMinuteWheel, { passive: false });

    return () => {
      hourElement.removeEventListener('wheel', handleHourWheel);
      minuteElement.removeEventListener('wheel', handleMinuteWheel);
    };
  }, [isOpen, selectedHour, selectedMinute, minutes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && event.target && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHourUpDisabled = () => {
    if (!isToday()) return false;
    
    const current = getCurrentTime();
    const newHour = selectedHour === 0 ? 23 : selectedHour - 1;
    return newHour < current.hour;
  };

  const isHourDownDisabled = () => {
    if (!isToday()) return false; 
    
    const current = getCurrentTime();
    const newHour = selectedHour === 23 ? 0 : selectedHour + 1;
    return newHour < current.hour;
  };

  const isMinuteUpDisabled = () => {
    if (!isToday()) return false; 
    
    const current = getCurrentTime();
    if (selectedHour > current.hour) return false;
    if (selectedHour < current.hour) return true;
    
    const currentIndex = minutes.indexOf(selectedMinute);
    const newIndex = currentIndex === 0 ? minutes.length - 1 : currentIndex - 1;
    const newMinute = minutes[newIndex];
    return newMinute <= current.minute;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative" ref={containerRef}>
        {/* Display Input */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            flex items-center justify-between text-left
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">
              {value ? formatDisplayTime(selectedHour, selectedMinute) : placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Picker */}
        {isOpen && (
          <div 
            className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="p-4">
              <div className="text-center text-sm font-medium text-gray-700 mb-3">
                เลือกเวลา
              </div>
              
              <div className="flex justify-center gap-8">
                {/* Hour Picker */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">ชั่วโมง</div>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleHourScroll('up')}
                      disabled={isHourUpDisabled()}
                      className={`p-1 rounded ${
                        isHourUpDisabled() 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    
                    <div 
                      ref={hourRef}
                      className="h-20 flex flex-col items-center justify-center bg-gray-50 rounded-lg px-3 cursor-pointer select-none"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedHour.toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleHourScroll('down')}
                      disabled={isHourDownDisabled()}
                      className={`p-1 rounded ${
                        isHourDownDisabled() 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Separator */}
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-gray-400 mt-6">:</div>
                </div>

                {/* Minute Picker */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">นาที</div>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleMinuteScroll('up')}
                      disabled={isMinuteUpDisabled()}
                      className={`p-1 rounded ${
                        isMinuteUpDisabled() 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    
                    <div 
                      ref={minuteRef}
                      className="h-20 flex flex-col items-center justify-center bg-gray-50 rounded-lg px-3 cursor-pointer select-none"
                    >
                      <div className="text-2xl font-bold text-green-600">
                        {selectedMinute.toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleMinuteScroll('down')}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Time Display - แสดงเฉพาะวันนี้ */}
              {isToday() && (
                <div className="mt-3 text-center text-xs text-gray-500">
                  เวลาปัจจุบัน: {formatDisplayTime(getCurrentTime().hour, getCurrentTime().minute)}
                </div>
              )}

              {/* Quick Time Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2 text-center">เวลาทำงาน</div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {[
                    { label: '09:00', hour: 9, minute: 0 },
                    { label: '12:00', hour: 12, minute: 0 },
                    { label: '13:00', hour: 13, minute: 0 },
                    { label: '17:00', hour: 17, minute: 0 }
                  ]
                  .filter(time => isTimeValid(time.hour, time.minute)) // แสดงเฉพาะเวลาที่ถูกต้อง
                  .map((time) => (
                    <button
                      key={time.label}
                      type="button"
                      onClick={() => {
                        setSelectedHour(time.hour);
                        setSelectedMinute(time.minute);
                        handleTimeChange(time.hour, time.minute);
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors"
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 bg-black text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  ตกลง
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isToday()) {
                      const validTime = getValidTimeForToday();
                      setSelectedHour(validTime.hour);
                      setSelectedMinute(validTime.minute);
                      handleTimeChange(validTime.hour, validTime.minute);
                    } else {
                      setSelectedHour(9);
                      setSelectedMinute(0);
                      handleTimeChange(9, 0);
                    }
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  รีเซ็ต
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};