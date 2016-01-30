(function(module) {
try {
  module = angular.module('ionic-datepicker.templates');
} catch (e) {
  module = angular.module('ionic-datepicker.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('ionic-datepicker-modal.html',
    '<ion-modal-view class="ionic_datepicker_modal">\n' +
    '  <ion-header-bar ng-class="modalHeaderColor">\n' +
    '    <h1 class="title">{{titleLabel}}</h1>\n' +
    '  </ion-header-bar>\n' +
    '  <ion-content class="ionic_datepicker_modal_content">\n' +
    '    <div class="ionic_datepicker">\n' +
    '      <div class="selected_date_full">{{selectedDateFull | date:"dd-MM-yyyy"}}</div>\n' +
    '      <div class="row">\n' +
    '        <div class="col col-10 left_arrow" ng-click="prevMonth()"\n' +
    '             ng-class="{\'pointer_events_none\':(enableDatesFrom.isSet && enableDatesFrom.epoch > currentMonthFirstDayEpoch)}">\n' +
    '          <button class="button-clear font_22px"\n' +
    '                  ng-class="{\'color_blue\':((enableDatesFrom.isSet && enableDatesFrom.epoch < currentMonthFirstDayEpoch) || (!enableDatesFrom.isSet))}">\n' +
    '            <i class="icon ion-chevron-left"></i>\n' +
    '          </button>\n' +
    '        </div>\n' +
    '        <div class="col col-80 drop_down">\n' +
    '          <div class="row select_section">\n' +
    '            <div class="col col-50 month_dropdown">\n' +
    '              <div class="list">\n' +
    '                <label class="item item-input item-select">\n' +
    '                  <select ng-model="currentMonth" ng-change="monthChanged(currentMonth)" class="month_select">\n' +
    '                    <option value="{{month}}" ng-repeat="month in monthsList"\n' +
    '                            ng-selected="month == currentMonthSelected">\n' +
    '                      {{month}}\n' +
    '                    </option>\n' +
    '                  </select>\n' +
    '                </label>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '            <div class="col col-50 year_dropdown">\n' +
    '              <div class="list">\n' +
    '                <label class="item item-input item-select">\n' +
    '                  <select ng-model="currentYear" ng-change="yearChanged(currentYear)" class="year_select">\n' +
    '                    <option value="{{year}}" ng-repeat="year in yearsList" ng-selected="year == currentYearSelected">\n' +
    '                      {{year}}\n' +
    '                    </option>\n' +
    '                  </select>\n' +
    '                </label>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="col col-10 right_arrow" ng-click="nextMonth()"\n' +
    '             ng-class="{\'pointer_events_none\':(enableDatesTo.isSet && enableDatesTo.epoch < currentMonthLastDayEpoch)}">\n' +
    '          <button class="button-clear font_22px"\n' +
    '                  ng-class="{\'color_blue\':((enableDatesTo.isSet && enableDatesTo.epoch > currentMonthLastDayEpoch) || (!enableDatesTo.isSet))}">\n' +
    '            <i class="icon ion-chevron-right"></i>\n' +
    '          </button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="calendar_grid">\n' +
    '        <div class="row">\n' +
    '          <div class="col text-center" ng-repeat="weekName in weekNames track by $index" style="font-weight: bold"> {{ weekName }}\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '          <div class="row" ng-repeat="row in rows track by $index" style="text-align: center;">\n' +
    '            <div class="col no_padding" ng-repeat="col in cols track by $index"\n' +
    '                 ng-class="{\'date_col\': (dayList[$parent.$index * numColumns + $index].day != undefined),\n' +
    '      \'date_selected\': (dayList[$parent.$index * numColumns + $index].dateString === selctedDateStringCopy && dayList[$parent.$index * numColumns + $index].day != undefined) ,\n' +
    '      \'today\' : (dayList[$parent.$index * numColumns + $index].date == today.date && dayList[$parent.$index * numColumns + $index].month == today.month && dayList[$parent.$index * numColumns + $index].year == today.year)}">\n' +
    '              <div class="date_cell" ng-click="dateSelected(dayList[$parent.$index * numColumns + $index])"\n' +
    '                   ng-class="{\'pointer_events_none\':(disabledDates.indexOf(dayList[$parent.$index * numColumns + $index].epochLocal) > -1) || (enableDatesFrom.isSet && enableDatesFrom.epoch > dayList[$parent.$index * numColumns + $index].epochLocal) || (enableDatesTo.isSet && enableDatesTo.epoch < dayList[$parent.$index * numColumns + $index].epochLocal)}">\n' +
    '                {{ dayList[$parent.$index * numColumns + $index].date }}\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="error_msg padding-horizontal"\n' +
    '           ng-show="date_selection.submitted === true && date_selection.selected === false">{{errorMsgLabel}}\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </ion-content>\n' +
    '  <ion-footer-bar  ng-class="modalFooterColor">\n' +
    '    <div class="row no_padding">\n' +
    '      <div class="col-33 text-center" ng-click="closeIonicDatePickerModal()"><button class="button button-clear">{{closeLabel}}</button></div>\n' +
    '      <div class="col-34 text-center" ng-click="setIonicDatePickerTodayDate()"><button class="button button-clear">{{todayLabel}}</button></div>\n' +
    '      <div class="col-33 text-center" ng-click="setIonicDatePickerDate()"><button class="button button-clear">{{setLabel}}</button></div>\n' +
    '    </div>\n' +
    '  </ion-footer-bar>\n' +
    '</ion-modal-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('ionic-datepicker.templates');
} catch (e) {
  module = angular.module('ionic-datepicker.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('ionic-datepicker-popup.html',
    '<div class="ionic-datepicker">\n' +
    '  <div class="selected_date_full">{{selectedDateFull | date:"yyyy-MM-dd"}}</div>\n' +
    '  <div class="row no_padding">\n' +
    '    <div class="col col-10 left_arrow" ng-click="prevMonth()"\n' +
    '         ng-class="{\'pointer_events_none\':(enableDatesFrom.isSet && enableDatesFrom.epoch > currentMonthFirstDayEpoch)}">\n' +
    '      <button class="button-clear"\n' +
    '              ng-class="{\'color_blue\':((enableDatesFrom.isSet && enableDatesFrom.epoch < currentMonthFirstDayEpoch) || (!enableDatesFrom.isSet))}">\n' +
    '        <i class="icon ion-chevron-left"></i>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '    <div class="col col-80 drop_down no_padding">\n' +
    '      <div class="row select_section">\n' +
    '        \n' +
    '\n' +
    '        <div class="col col-50 year_dropdown">\n' +
    '          <div class="list">\n' +
    '            <label class="item item-input item-select">\n' +
    '              <select ng-model="currentYear" ng-change="yearChanged(currentYear)" class="year_select">\n' +
    '                <option value="{{year}}" ng-repeat="year in yearsList" ng-selected="year == currentYearSelected">\n' +
    '                  {{year}}\n' +
    '                </option>\n' +
    '              </select>\n' +
    '            </label>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="col col-50 month_dropdown">\n' +
    '          <div class="list">\n' +
    '            <label class="item item-input item-select">\n' +
    '              <select ng-model="currentMonth" ng-change="monthChanged(currentMonth)" class="month_select">\n' +
    '                <option value="{{month}}" ng-repeat="month in monthsList" ng-selected="month == currentMonthSelected">\n' +
    '                  {{month}}\n' +
    '                </option>\n' +
    '              </select>\n' +
    '            </label>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        \n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="col col-10 right_arrow" ng-click="nextMonth()"\n' +
    '         ng-class="{\'pointer_events_none\':(enableDatesTo.isSet && enableDatesTo.epoch < currentMonthLastDayEpoch)}">\n' +
    '      <button class="button-clear"\n' +
    '              ng-class="{\'color_blue\':((enableDatesTo.isSet && enableDatesTo.epoch > currentMonthLastDayEpoch) || (!enableDatesTo.isSet))}">\n' +
    '        <i class="icon ion-chevron-right"></i>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="calendar_grid">\n' +
    '    <div class="row">\n' +
    '      <div class="col" ng-repeat="weekName in weekNames track by $index" style="font-weight: bold"> {{ weekName }}</div>\n' +
    '    </div>\n' +
    '    <div style="height: 180px;">\n' +
    '      <div class="row" ng-repeat="row in rows track by $index" style="text-align: center;">\n' +
    '        <div class="col no_padding" ng-repeat="col in cols track by $index"\n' +
    '             ng-class="{\'date_col\': (dayList[$parent.$index * numColumns + $index].day != undefined),\n' +
    '      \'date_selected\': (dayList[$parent.$index * numColumns + $index].dateString === selctedDateStringCopy && dayList[$parent.$index * numColumns + $index].day != undefined) ,\n' +
    '      \'today\' : (dayList[$parent.$index * numColumns + $index].date == today.date && dayList[$parent.$index * numColumns + $index].month == today.month && dayList[$parent.$index * numColumns + $index].year == today.year)}">\n' +
    '          <div class="date_cell" ng-click="dateSelected(dayList[$parent.$index * numColumns + $index])"\n' +
    '               ng-class="{\'pointer_events_none\':(disabledDates.indexOf(dayList[$parent.$index * numColumns + $index].epochLocal) > -1) || (enableDatesFrom.isSet && enableDatesFrom.epoch > dayList[$parent.$index * numColumns + $index].epochLocal) || (enableDatesTo.isSet && enableDatesTo.epoch < dayList[$parent.$index * numColumns + $index].epochLocal)}">\n' +
    '            {{ dayList[$parent.$index * numColumns + $index].date }}\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="error_msg padding-horizontal"\n' +
    '       ng-show="date_selection.submitted === true && date_selection.selected === false">{{errorMsgLabel}}\n' +
    '  </div>\n' +
    '</div>');
}]);
})();
