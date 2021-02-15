var MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

$(function () {
  startMonth = 1;
  startYear = 2020;
  endMonth = 1;
  endYear = 2022;
  fiscalMonth = 7;
  if (startMonth < 10)
    startDate = parseInt("" + startYear + "0" + startMonth + "");
  else startDate = parseInt("" + startYear + startMonth + "");
  if (endMonth < 10) endDate = parseInt("" + endYear + "0" + endMonth + "");
  else endDate = parseInt("" + endYear + endMonth + "");

  content = '<div class="row mpr-calendarholder">';
  calendarCount = endYear - startYear;
  if (calendarCount == 0) calendarCount++;
  var d = new Date();
  for (y = 0; y < 2; y++) {
    content +=
      '<div class="col-xs-6" ><div class="mpr-calendar row" id="mpr-calendar-' +
      (y + 1) +
      '">' +
      '<h5 class="col-xs-12"><i class="mpr-yeardown fa fa-chevron-circle-left"></i><span>' +
      (startYear + y).toString() +
      '</span><i class="mpr-yearup fa fa-chevron-circle-right"></i></h5><div class="mpr-monthsContainer"><div class="mpr-MonthsWrapper">';
    for (m = 0; m < 12; m++) {
      var monthval;
      if (m + 1 < 10) monthval = "0" + (m + 1);
      else monthval = "" + (m + 1);
      content +=
        '<span data-month="' +
        monthval +
        '" class="col-xs-3 mpr-month">' +
        MONTHS[m] +
        "</span>";
    }
    content += "</div></div></div></div>";
  }

  $(document).on("click", ".mpr-month", function (e) {
    e.stopPropagation();
    $month = $(this);
    var monthnum = $month.data("month");
    var year = $month
      .parents(".mpr-calendar")
      .children("h5")
      .children("span")
      .html();
    if ($month.parents("#mpr-calendar-1").size() > 0) {
      //Start Date
      startDate = parseInt("" + year + monthnum);
      if (startDate > endDate) {
        if (year != parseInt(endDate / 100))
          $(".mpr-calendar:last h5 span").html(year);
        endDate = startDate;
      }
      console.log(startDate, "start date");
    } else {
      //End Date
      endDate = parseInt("" + year + monthnum);
      if (startDate > endDate) {
        if (year != parseInt(startDate / 100))
          $(".mpr-calendar:first h5 span").html(year);
        startDate = endDate;
      }
      console.log(endDate, "end date");
    }

    paintMonths();
  });

  var mprVisible = false;
  var mprpopover = $(".mrp-container")
    .popover({
      container: "body",
      placement: "bottom",
      html: true,
      content: content,
    })
    .on("show.bs.popover", function () {
      $(".popover").remove();
      var waiter = setInterval(function () {
        if ($(".popover").size() > 0) {
          clearInterval(waiter);
          setViewToCurrentYears();
          paintMonths();
        }
      }, 50);
    })
    .on("shown.bs.popover", function () {
      mprVisible = true;
    })
    .on("hidden.bs.popover", function () {
      mprVisible = false;
    });

  $(document).on("click", ".mpr-calendarholder", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
  $(document).on("click", ".mrp-container", function (e) {
    if (mprVisible) {
      e.preventDefault();
      e.stopPropagation();
      mprVisible = false;
    }
  });
  $(document).on("click", function (e) {
    if (mprVisible) {
      $(".mpr-calendarholder")
        .parents(".popover")
        .fadeOut(200, function () {
          $(".mpr-calendarholder").parents(".popover").remove();
          $(".mrp-container").trigger("click");
        });
      mprVisible = false;
    }
  });
});

function setViewToCurrentYears() {
  var startyear = parseInt(startDate / 100);
  var endyear = parseInt(endDate / 100);
  $(".mpr-calendar h5 span").eq(0).html(startyear);
  $(".mpr-calendar h5 span").eq(1).html(endyear);
}

function paintMonths() {
  $(".mpr-calendar").each(function () {
    var $cal = $(this);
    var year = $("h5 span", $cal).html();
    $(".mpr-month", $cal).each(function (i) {
      if (i + 1 > 9) cDate = parseInt("" + year + (i + 1));
      else cDate = parseInt("" + year + "0" + (i + 1));
      if (cDate >= startDate && cDate <= endDate) {
        $(this).addClass("mpr-selected");
      } else {
        $(this).removeClass("mpr-selected");
      }
    });
  });
  $(".mpr-calendar .mpr-month").css("background", "");
  //Write Text
  var startyear = parseInt(startDate / 100);
  var startmonth = parseInt(safeRound(startDate / 100 - startyear) * 100);
  var endyear = parseInt(endDate / 100);
  var endmonth = parseInt(safeRound(endDate / 100 - endyear) * 100);
  $(".mrp-monthdisplay .mrp-lowerMonth").html(
    MONTHS[startmonth - 1] + " " + startyear
  );
  $(".mrp-monthdisplay .mrp-upperMonth").html(
    MONTHS[endmonth - 1] + " " + endyear
  );
  $(".mpr-lowerDate").val(startDate);
  $(".mpr-upperDate").val(endDate);
  if (startyear == parseInt($(".mpr-calendar:first h5 span").html()))
    $(".mpr-calendar:first .mpr-selected:first").css("background", "#40667A");
  if (endyear == parseInt($(".mpr-calendar:last h5 span").html()))
    $(".mpr-calendar:last .mpr-selected:last").css("background", "#40667A");
}

function safeRound(val) {
  return Math.round((val + 0.00001) * 100) / 100;
}
