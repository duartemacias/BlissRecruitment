/*
 
*/

var viewModel;

function convertDebugStyleToBootstrap(level) {
    if (level == "debug" || level == "trace") {
        return "";//"success";
    } else if (level == "warn") {
        return "warning";
    } else {
        // if none is configured, let default one
        return level;
    }
}

function printValue(dtm) {

    var d1 = dtm;

    var curr_year = d1.getFullYear();

    var curr_month = d1.getMonth() + 1; //Months are zero based
    if (curr_month < 10)
        curr_month = "0" + curr_month;

    var curr_date = d1.getDate();
    if (curr_date < 10)
        curr_date = "0" + curr_date;

    var curr_hour = d1.getHours();
    if (curr_hour < 10)
        curr_hour = "0" + curr_hour;

    var curr_min = d1.getMinutes();
    if (curr_min < 10)
        curr_min = "0" + curr_min;

    var curr_sec = d1.getSeconds();
    if (curr_sec < 10)
        curr_sec = "0" + curr_sec;

    //console.log(d1.getMilliseconds());
    var curr_msec = "00" + d1.getMilliseconds();
    curr_msec = curr_msec.substring((curr_msec.length - 3), curr_msec.length)

    var newtimestamp = curr_hour + ":" + curr_min + ":" + curr_sec + "." + curr_msec;

    return newtimestamp;
}

function showDetails(detail) {
    $('#eventDetails').text(detail.data);
    $('#myModal').modal('show');
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function searchByTransactionId(id) {
    viewModel.transactionSearch.filterCorrelationId(id);
    viewModel.transactionSearch.searchByCorrelationId($("#frmSearch"));
}

$(function () {

    viewModel = {
        showModal: window.ko.observable(false),

        stats: {
            lastHourCount: window.ko.observable(0),
            todayCount: window.ko.observable(0),
            last7Count: window.ko.observable(0),
            last30Count: window.ko.observable(0),
        },
        transactionSearch: {
            searchByCorrelationId: function (element) {
                var frm = $(element);
                frm.find('button[type="submit"]').attr("disabled", "disabled").html("<i class=\"fa fa-circle-o-notch fa-spin\" aria-hidden=\"true\"></i>");

                viewModel.transactionSearch.correlationId();
                viewModel.transactionSearch.statusCode();
                viewModel.transactionSearch.requestBody();
                viewModel.transactionSearch.responseBody();
                viewModel.transactionSearch.executionStart();
                viewModel.transactionSearch.executionEnd();
                viewModel.transactionSearch.requestUrl();
                viewModel.transactionSearch.exception();
                viewModel.transactionSearch.requestType();

                $.getJSON(window.searchUrl, { "correlationId": viewModel.transactionSearch.filterCorrelationId() })
                    .done(function (result) {
                        if (result.ErrorMessage != null) {
                            alert(result.ErrorMessage)
                        } else {
                            viewModel.showModal(true);
                            $($('#modalTransactionDetails a.nav-link').removeClass('active').get(0)).addClass("active");
                            $('#modalTransactionDetails div.tab-pane').removeClass('active');
                            $('#transDetails').tab('show');
                            viewModel.transactionSearch.correlationId(result.CorrelationId);
                            viewModel.transactionSearch.statusCode(result.StatusCode);
                            viewModel.transactionSearch.requestUrl(result.RequestUrl);
                            viewModel.transactionSearch.requestBody(decodeURIComponent(result.RequestBody));
                            viewModel.transactionSearch.responseBody(decodeURIComponent(result.ResponseBody));
                            viewModel.transactionSearch.executionStart(moment(result.ExecutionStartUTCDate).format());
                            viewModel.transactionSearch.executionEnd(moment(result.ExecutionEndUTCDate).format());

                            viewModel.transactionSearch.exception(result.Exception + "<br>" + result.ExceptionStack);
                            viewModel.transactionSearch.requestType(result.ContentType);
                        }
                    }).fail(function (jqxhr, textStatus, error) {
                        var err = textStatus + ", " + error;
                        console.log("Request Failed: " + err);
                    });
                frm.find('button[type="submit"]').text("Search").removeAttr("disabled");
                return false;
            },
            filterByCorrelationId: function (element) {
                var filterEnabled = $('#frmSearch button.live-filter').hasClass('btn-info');

                if (viewModel.transactionSearch.filterCorrelationId() && filterEnabled == false) {
                    $('#frmSearch button.live-filter').removeClass('btn-outline-info');
                    $('#frmSearch button.live-filter').addClass('btn-info');

                    $($.grep($("#log-table tbody tr"), function (elem, i) { return $(elem).find("td:first a").text() != viewModel.transactionSearch.filterCorrelationId(); })).hide();
                }
                else {
                    $('#frmSearch button.live-filter').removeClass('btn-info');
                    $('#frmSearch button.live-filter').addClass('btn-outline-info');

                    $("#log-table tbody tr").show();
                }
            },
            filterCorrelationId: window.ko.observable(),
            correlationId: window.ko.observable(),
            statusCode: window.ko.observable(),
            requestBody: window.ko.observable(),
            responseBody: window.ko.observable(),
            requestUrl: window.ko.observable(),
            executionStart: window.ko.observable(),
            executionEnd: window.ko.observable(),
            exception: window.ko.observable(),
            requestType: window.ko.observable()
        }

    }

    window.ko.applyBindings(viewModel);

    $.getJSON(window.globalStatsUrl, { "correlationId": $("#txtCorrelationId").val() }).done(function (result) {
        viewModel.stats.lastHourCount(result.LastHourTotalRequests);
        viewModel.stats.todayCount(result.TodayTotalRequests);
        viewModel.stats.last7Count(result.Last7DaysTotalRequests);
        viewModel.stats.last30Count(result.Last30DaysTotalRequests);
    });

    var log4net = $.connection.signalR2AppenderHub;
    var cnt = 0

    log4net.client.onLoggedEvent = function (formattedEvent, loggedEvent) {
        //if (console && console.log)
        //    console.log("onLoggedEvent", formattedEvent, loggedEvent);

        if (cnt > 3000) {
            $('#log-table tbody tr:last').remove();
        }

        var cId = loggedEvent.Properties["X-Correlation-Id"];
        var dtm = new Date(Date.parse(loggedEvent.TimeStamp));
        var cidCell = $("<td>").css("white-space", "nowrap").html('<a href="#" onclick="javascript:searchByTransactionId(\'' + cId + '\')">' + cId + '</a>');
        var dateCell = $("<td>").css("white-space", "nowrap").text(printValue(dtm));
        var levelCell = $("<td>").text(loggedEvent.Level.Name);
        var detailsCell = $("<td>").text(loggedEvent.Message);
        var row = $("<tr>").append(cidCell, dateCell, levelCell, detailsCell);
        row = row.addClass("table-" + convertDebugStyleToBootstrap(loggedEvent.Level.Name.toLowerCase()));

        var filterEnabled = $('#frmSearch button.live-filter').hasClass('btn-info');
        if (viewModel.transactionSearch.filterCorrelationId() && filterEnabled == true) {
            $($.grep($(row), function (elem, i) { return $(elem).find("td:first a").text() != viewModel.transactionSearch.filterCorrelationId(); })).hide();
        }

        $('#log-table tbody').prepend(row);

        cnt++;
    };

    //$.connection.hub.logging = true;
    $.connection.hub.start()
    .done(function () {
        log4net.server.listen();
    })
    .fail(function (reason) {
        var msg = "SignalR connection failed: " + reason;
        $("#activeLog").prepend('<div class="alert alert-warning" role="alert"><strong>Warning!</strong> Could not connect to server. Please <a href="' + window.logUrl + '">refresh</a> the page.</div>') >
        console.log(msg);
    });

    var table = $('#tblTransactions').DataTable({
        buttons: ['copy', 'excel', 'pdf'/*, 'colvis'*/, {
            text: 'Reload',
            action: function (e, dt, node, config) {
                dt.ajax.reload();
            }
        }],
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": window.transactionsListUrl,
            "method": "POST"
        },
        "columns": [
            {
                "data": "correlationId", "render": function (data, type, row) {
                    return '<a href="#" onclick="javascript:searchByTransactionId(\'' + data + '\')">' + data + '</a>';
                }
            },
            { "data": "status" },
            { "data": "executionDate" }
        ],
        "language": {
            "emptyTable": "There are no transactions at present.",
            "zeroRecords": "There were no matching transactions found."
        },
        "initComplete": function (settings, json) {
            table.buttons().container().appendTo('#tblTransactions_wrapper .col-md-6:eq(1)').addClass("pull-right");
        },
        "searching": false, // <-- this should be set to true
        "ordering": false, // <-- this should be set to true
        "paging": true // <-- this should be set to true
    });


});

window.ko.bindingHandlers.modal = {
    init: function (element, valueAccessor) {
        $(element).modal({
            show: false
        });

        var value = valueAccessor();
        if (typeof value === 'function') {
            $(element).on('hide.bs.modal', function () {
                value(false);
            });
        }
        window.ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).modal("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var isOpen = $(element).data('bs.modal')._isShown;
        if (window.ko.utils.unwrapObservable(value)) {
            if (!isOpen) {
                $(element).modal('show');
            }
        } else {
            if (isOpen) {
                $(element).modal('hide');
            }
        }
    }
};
