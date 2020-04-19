var debug = document.getElementById("debug");

var numbers = [];
for (var i = 1; i <= 90; i++) {
    numbers.push(i);
}
var tempNum1 = [];
var tempNum2 = [];
var tickets = [];

// Swap on click feature start
var firstForSwap = true;
var swapTicNum1 = 0;
var swapRow1 = -1;
var swapCol1 = -1;
for (var ticNum = 0; ticNum < 12; ticNum++)
{
    var name = "ticket";
    name = name+(ticNum+1);
    var tbl = document.getElementById(name);
    if (tbl != null) {
        for (var rNum = 0; rNum < tbl.rows.length; rNum++) {
            for (var j = 0; j < tbl.rows[rNum].cells.length; j++)
                tbl.rows[rNum].cells[j].onclick = function () { cellClicked(this); };
        }
    }
}

function cellClicked(cel) {
    var swapRow = -1;
    var swapCol = -1;
    for (var swapTicNum = 0; swapTicNum < 12; swapTicNum++)
    {
        var found = false;
        var name = "ticket";
        name = name+(swapTicNum+1);
        var tbl = document.getElementById(name);
        if (tbl != null) {
            for (var rNum = 0; rNum < tbl.rows.length; rNum++)
            {
                for (var j = 0; j < tbl.rows[rNum].cells.length; j++)
                {
                    if (tbl.rows[rNum].cells[j] == cel)
                    {
                        swapRow = rNum;
                        swapCol = j;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }
        if (found) break;
    }
    if (firstForSwap)
    {
        debug.innerHTML = debug.innerHTML + "Ticket: " + swapTicNum + " row: " + swapRow + " col: " + swapCol + "<br/>";
        swapTicNum1 = swapTicNum;
        swapRow1 = swapRow;
        swapCol1 = swapCol;
    }
    else
    {
        if (swapCol == swapCol1)
        {
            var swapVal2 = tickets[swapTicNum][swapRow][swapCol];
            tickets[swapTicNum][swapRow][swapCol] = tickets[swapTicNum1][swapRow1][swapCol1];
            tickets[swapTicNum1][swapRow1][swapCol1] = swapVal2;
            debug.innerHTML = debug.innerHTML + "Ticket: " + swapTicNum + " row: " + swapRow + " col: " + swapCol + "<br/>";
            sortAndPrint();
        }
        else
        {
            alert("Error: Choose same column to swap.");
        }
        swapTicNum = 0;
        swapRow = -1;
        swapCol = -1;
    }
    firstForSwap = !firstForSwap;
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        firstForSwap = true;
        swapTicNum = 0;
        swapRow = -1;
        swapCol = -1;
    }
};
// Swap on click feature end

var colms = [];
for (var i = 0; i < 9; i++) {
    colms.push(i);
}
function getRandomnum(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}
function printDiv(divName) {

    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    //document.getElementById(divName).appendElement(vl);

    window.print();

    document.body.innerHTML = originalContents;
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function setNumInTable(table, row, col, num) {
    var table = document.getElementById(table);
    var cells = table.rows.item(row).cells;
    cells[col].innerHTML = num;
}

function getListOfNum(arry, i) {
    var min = i*10;
    var max = i*10 + 9;
    if (min == 0)
    {
        min = 1;
    }
    else if (min == 80)
    {
        max++;
    }
    var found = false;
    var listOfNum = [];
    listOfNum.length = 0;
    for (var ii = 0; ii < arry.length; ii++)
    {
        if (arry[ii] >= min && arry[ii] <= max)
        {
            found = true;
            listOfNum.push(arry[ii]);
        }
        else if(found)
        {
            break;
        }
    }
    return listOfNum;
}

function isValidEmpty(ticket, row, col)
{
    var one = (col > 0 && col < 8 && ticket[row][col-1] != "" && ticket[row][col+1] != "");
    var two = (col > 1 && ticket[row][col-2] != "" && ticket[row][col-1] != "");
    var three = (col < 7 && ticket[row][col+1] != "" && ticket[row][col+2] != "");
    return !(one || two || three);
}

function findEmptyRows(ticket, col)
{
    var emptyRows = [];
    emptyRows.length = 0;
    for (var i = 0; i < 3; i++)
    {
        if (ticket[i][col] == "" && isValidEmpty(ticket, i, col))
        {
            emptyRows.push(i);
        }
    }
    return emptyRows;
}

function numsInRow(ticket, row)
{
    var count = 0
    for (var i = 0; i < 9; i++)
    {
        if (ticket[row][i] != "")
        {
            count++;
        }
    }
    return count;
}

function isRowFull(ticket, row)
{
    return numsInRow(ticket, row) >= 5;
}

function availableEmptyInCol(ticket, col)
{
    var availableEmpty = findEmptyRows(ticket, col);
    for (var i = 0; i < availableEmpty.length; i++)
    {
        if (isRowFull(ticket, availableEmpty[i]))
        {
            availableEmpty.remove(availableEmpty[i]);
        }
    }
    return availableEmpty;
}

function swap(ticket, i, j, col) {
    if(ticket[i][col] != "" && ticket[j][col] != "" && ticket[i][col]  > ticket[j][col]) {
        var temp = ticket[i][col];
        ticket[i][col] = ticket[j][col];
        ticket[j][col] = temp;
    }
}

function cellsToBeFilledInRows(ticket)
{
    var cellsToBeFilled = [];
    for (var i = 0; i < 3; i++)
    {
        cellsToBeFilled.push(5 - numsInRow(ticket, i));
    }
    return cellsToBeFilled;
}

function validEmptyIndexInRow(ticket, row)
{
    var valids = [];
    for (var i = 0; i < 9; i++)
    {
        if (ticket[row][i] == "" && isValidEmpty(ticket, row, i))
        {
            valids.push(i);
        }
    }
    return valids;
}

function complete(tickets, start, tempNum)
{
    if (tempNum.length == 0) return;

    var ticketNums = [start, start + 1, start + 2, start + 3, start + 4, start + 5];
    while(ticketNums.length > 0)
    {
        var ticketNum = ticketNums[getRandomnum(ticketNums.length)];
        ticketNums.remove(ticketNum);
        var ticket = tickets[ticketNum];
        var cellsToBeFilled = cellsToBeFilledInRows(ticket);
        for (var i = 0; i < cellsToBeFilled.length; i++)
        {
            if (cellsToBeFilled[i] != 0)
            {
                //debug.innerHTML = debug.innerHTML + "<br/>" + "at " + i + ": " + cellsToBeFilled[i] + ": ";
                while (cellsToBeFilled[i] > 0)
                {
                    var valids = validEmptyIndexInRow(ticket, i);
                    var filled = false;
                    while (!filled && valids.length > 0)
                    {
                        var cellNum = valids[getRandomnum(valids.length)];
                        var nums = getListOfNum(tempNum, cellNum);
                        if (nums.length > 0)
                        {
                            var value = nums[getRandomnum(nums.length)];
                            ticket[i][cellNum] = value;
                            tempNum.remove(value);
                            cellsToBeFilled[i]--;
                            filled = true;
                        }
                        valids.remove(cellNum);
                    }
                    if (!filled && valids.length == 0 && cellsToBeFilled[i] > 0)
                    {
                        debug.innerHTML = debug.innerHTML + "<br/>" + "Ticket: " + (ticketNum + 1) + ":: "
                                          + "<br/>" + "at row " + (i + 1) + ": " + "Could not fill " + cellsToBeFilled[i] + " cell(s) <br/>";
                        break;
                    }
                }
            }
        }
    }
    debug.innerHTML = debug.innerHTML + "<br/>Numbers Left: "+ tempNum.length + "<br/>";
    for (var i = 0; i < tempNum.length; i++)
    {
        debug.innerHTML = debug.innerHTML + tempNum[i] + " ";
    }
    debug.innerHTML = debug.innerHTML + "<br/>";
}

function tryAndComplete()
{
    debug.innerHTML = debug.innerHTML + "</br>-----------------------------------------------</br>";
    complete(tickets, 0, tempNum1);
    complete(tickets, 6, tempNum2);
    sortAndPrint();
}

function generate6Tickets(tickets, start, tempNum)
{
    for (var i = 0; i < 9; i++)
    {
        var nums = getListOfNum(tempNum, i);
        for (var j = start; j < start + 6; j++)
        {
            var num = nums[getRandomnum(nums.length)];
            nums.remove(num);
            tempNum.remove(num);
            var ticket = tickets[j];
            var rn = getRandomnum(3);
            ticket[rn][i] = num;
        }
    }
    for (var i = start; i < start + 6; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            var ticket = tickets[i];
            for (var k = 0; k < 3; k++)
            {
                if (j > 0 && ticket[k][j] != "" && ticket[k][j-1] != "" && ticket[k][j+1] != "")
                {
                    var empty = findEmptyRows(ticket, j);
                    var rk = empty[getRandomnum(empty.length)];
                    ticket[rk][j] = ticket[k][j];
                    ticket[k][j] = "";
                }
            }
        }
    }

    var totalInColm = [12, 12, 12, 12, 12, 12, 12, 12, 12];
    for (var i = start; i < start + 6; i++)
    {
        var tempColms = [...colms];
        //debug.innerHTML = debug.innerHTML + "<br/>" + "Ticket: " + i + ":: ";
        while (tempColms.length > 0)
        {
            var col = tempColms[getRandomnum(tempColms.length)];
            tempColms.remove(col);
            var ticket = tickets[i];
            var availables = [...availableEmptyInCol(ticket, col)];
            //debug.innerHTML = debug.innerHTML + "<br/>" + "available in: " + col + ":: ";
            /*for (var k=0; k < availables.length; k++)
            {
                debug.innerHTML = debug.innerHTML + availables[k] + " ";
            }*/
            var nums = getListOfNum(tempNum, col);
            //debug.innerHTML = debug.innerHTML + "<br/>" + "pushing in: " + col + ":: ";
            for (var k=0; k < availables.length; k++)
            {
                var randIndex = getRandomnum(totalInColm[col]);
                if (isRowFull(ticket, availables[k]))
                {
                    //debug.innerHTML = debug.innerHTML + "<br/>" + "ERROR!!!!!!!!!!!!! in: " + availables[k] + ":: ";
                    //return;
                }
                if (randIndex < nums.length && !isRowFull(ticket, availables[k]))
                {
                    ticket[availables[k]][col] = nums[randIndex];
                    //debug.innerHTML = debug.innerHTML + "at: " + availables[k] + ": " + nums[randIndex] + " ";
                    tempNum.remove(nums[randIndex]);
                    nums.remove(nums[randIndex]);
                }
            }
            totalInColm[col] = totalInColm[col] - 2;
        }
    }
    /*var ticketNums = [start, start + 1, start + 2, start + 3, start + 4, start + 5];
    while(ticketNums.length > 0)
    {
        var ticketNum = ticketNums[getRandomnum(ticketNums.length)];
        ticketNums.remove(ticketNum);
        var ticket = tickets[ticketNum];
        var cellsToBeFilled = cellsToBeFilledInRows(ticket);
        debug.innerHTML = debug.innerHTML + "<br/>" + "Ticket: " + ticketNum + ":: ";
        for (var i = 0; i < cellsToBeFilled.length; i++)
        {
            if (cellsToBeFilled[i] != 0)
            {
                debug.innerHTML = debug.innerHTML + "<br/>" + "at " + i + ": " + cellsToBeFilled[i] + ": ";
                while (cellsToBeFilled[i] > 0)
                {
                    var valids = validEmptyIndexInRow(ticket, i);
                    var filled = false;
                    while (!filled && valids.length > 0)
                    {
                        var cellNum = valids[getRandomnum(valids.length)];
                        var nums = getListOfNum(tempNum, cellNum);
                        if (nums.length > 0)
                        {
                            var value = nums[getRandomnum(nums.length)];
                            ticket[i][cellNum] = value;
                            tempNum.remove(value);
                            cellsToBeFilled[i]--;
                            filled = true;
                        }
                        valids.remove(cellNum);
                    }
                    if (!filled && valids.length == 0 && cellsToBeFilled[i] > 0)
                    {
                        debug.innerHTML = debug.innerHTML + "Could not fill " + cellsToBeFilled[i] + "cell(s) <br/>";
                        break;
                    }
                }
            }
        }
    }*/
    complete(tickets, start, tempNum);
}

function sortAndPrint()
{
    for (var i = 0; i < 12; i++) {
        ticket = tickets[i];
        for (var k = 0; k < 9; k++) {
                swap(ticket, 0, 1, k);
                swap(ticket, 1, 2, k);
                swap(ticket, 0, 2, k);
                swap(ticket, 0, 1, k);
        }
    }
    for (var i = 0; i < 12; i++) {
        var name = "ticket";
        name = name+(i+1);
        var ticket = tickets[i];
        for (var j = 0; j < 3; j++) {
            var row = ticket[j];
            for (var k = 0; k < 9; k++) {
                setNumInTable(name, j, k, row[k]);
            }
        }
    }
}

function generateClick() {
    for (var i = 0; i < 12; i++) {
        var ticket = []
        for (var j = 0; j < 3; j++) {
            row = [];
            for (var k = 0; k < 9; k++) {
                row.push("");
            }
            ticket.push(row);
        }
        tickets.push(ticket);
    }

    tempNum1 = [...numbers];
    tempNum2 = [...numbers];
    generate6Tickets(tickets, 0, tempNum1);
    generate6Tickets(tickets, 6, tempNum2);

    sortAndPrint();
}
