/* JavaScript code for weeksdays.html */

var monthNumberArr = [ 0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5 ];
var weekDayArr = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
var dayErrMsg = "Please use only numerical values between 1 and 31 for 'day' (DD).";
var monthErrMsg = "Please use only numerical values between 1 and 12 for 'month' (MM).";
var yearErrMsg = "Please use only numerical values between 1582 und 4000 for 'year' (YYYY).";

$(document).ready(function() {
   $("#calc").click(calcWeekDayAndSetResult);
   $("#day,#month,#year").keydown(clearResult);
   $("#day,#month,#year").keypress(checkForEnter);
   $("#debug-enabled").change(toggleDebugVisibility);
   $("#debug-enabled-text").click(function() {
      $("#debug-enabled").trigger("click");
   });
   $("#error-messages-close").click(function() { $("#error-messages").hide(); });
});

function toggleDebugVisibility() {
   var debugEnabled = $(this).prop('checked');
   if(debugEnabled) {
      $("#debug-output-box").show();
   } else {
      $("#debug-output-box").hide();
   }
}

function calcWeekDayAndSetResult() {
   clearDebugOutput();
   var dayInput = getValueAsNumber("#day");
   var monthInput = getValueAsNumber("#month");
   var yearInput = getValueAsNumber("#year");
   if(!checkInputValues(dayInput, monthInput, yearInput)) {
      return;
   }
   var weekDayStr = calcWeekDay(dayInput, monthInput, yearInput);
   $("#result").html(" &nbsp;&rarr;&nbsp; " + weekDayStr);
}

function clearResult() {
   if($("#result").html() != "") {
      $("#result").fadeOut(300, function() {
         $(this).html("");
         $(this).show();
      });
   }
}

function checkForEnter(e) {
   if(e.which == 13) {
      calcWeekDayAndSetResult();
   }
}

function calcWeekDay(day, month, year) {
   // implemented based ob description on this page: https://de.wikipedia.org/wiki/Wochentagsberechnung
   
   var dayNum = day % 7;
   appendToDebugOutput("Day Number = " + dayNum);
   
   var monthNum = monthNumberArr[month - 1];
   appendToDebugOutput("Month Number = " + monthNum);
   
   var yearInCentury = year % 100;
   var yearNum = (yearInCentury + Math.floor(yearInCentury/4)) % 7;
   appendToDebugOutput("Year Number = " + yearNum);
   
   var centuryNum = (3 - (Math.floor(year / 100) % 4)) * 2;
   appendToDebugOutput("Century Number = " + centuryNum);
   
   var leapYearNum = month < 3 ? -1 : 0;
   appendToDebugOutput("Leap Year Number = " + leapYearNum);
   
   var weekday = (dayNum + monthNum + yearNum + centuryNum + leapYearNum) % 7;
   appendToDebugOutput("Resulting Weekday = " + weekday);
   return weekDayArr[weekday];
}

function checkInputValues(dayInput, monthInput, yearInput) {
   clearErrorOutput();
   var errors = assertCondition(isNumberAndInRange(dayInput, 1, 31), "#day", dayErrMsg);
   errors += assertCondition(isNumberAndInRange(monthInput, 1, 12), "#month", monthErrMsg);
   errors += assertCondition(isNumberAndInRange(yearInput, 1582, 4000), "#year",yearErrMsg);
   if(errors > 0) {
      showErrorOutput();
      return false;
   }
   return true;
}

function isNumberAndInRange(theValue, minValue, maxValue) {
   return theValue != "" && isNumber(theValue) && parseInt(theValue) <= maxValue && parseInt(theValue) >= minValue;
}

function clearErrorOutput() {
   $("#day,#month,#year").removeClass("input-error");
   $("#error-messages-text").html("");
   $("#error-messages").hide();
}

function assertCondition(condition,inputSelector,errorMsg) {
   if(!condition) {
      $("#error-messages-text").append(errorMsg+"<br>");
      $(inputSelector).addClass("input-error");
      inputErrors = true;
      return 1;
   }
   return 0;
}

function isNumber(data) {
   return Number(data) === parseInt(""+data, 10);
}

function showErrorOutput() {
   $("#error-messages").show();
}

function getValueAsNumber(inputId) {
   var inputVal = $(inputId).val();
   return parseInt(inputVal);
}

function appendToDebugOutput(theString) {
   $("#debug-output").append(theString + "<br>");
}

function clearDebugOutput() {
   $("#debug-output").html("");
}
