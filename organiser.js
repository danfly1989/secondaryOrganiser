/**
 * Javascript
 * @author Brendan Kehoe
 */

var currentCell;
var durationHour;
var currentEditLeft;
var currentEditTop;
var currentEditWidth;
var currentEditHeight;
var normal = true;

function expandTables() {
	var hoursTable = document.getElementById("hours");
	var monday = document.getElementById("monday");
	var tuesday = document.getElementById("tuesday");
	expandHours(hoursTable);
	expandTable(monday);
	expandTable(tuesday);
	expandTable(wednesday);
	expandTable(thursday);
	expandTable(friday);
	expandTable(saturday);
	expandTable(sunday);
}

function expandHours(hoursTable) {
	createHeading(hoursTable);
	createHours(hoursTable);
}

function createHeading(table) {
	var row = document.createElement('tr');
	table.appendChild(row);
	var heading = document.createElement('th');
	row.appendChild(heading);
	// heading.style.border = "1px solid black";
	heading.innerHTML = table.id;
}

function createHours(table) {
	for (var i = 0; i < 24; i++) {
		var row = document.createElement('tr');
		table.appendChild(row);
		var cell = row.insertCell();
		cell.style.border = "1px solid black";
		cell.innerHTML = i + ":00";
	}
}

function expandTable(table) {
	createHeading(table);
	for (var i = 0; i < 24; i++) {
		var row = document.createElement("tr");
		table.appendChild(row);
		var cell = document.createElement("td");
		row.appendChild(cell);
		cell.className = i;
		cell.addEventListener("click", displayForm);
		cell.style.border = "1px solid black";
		cell.rowspan = "2";
		var div = document.createElement("div");
		cell.appendChild(div);
		div.style.height = "24px";
		div.style.width = window.innerWidth / 8 + "px";
		div.style.overflow = "auto";
		// div.style.maxWidth="100px";
		div.appendChild(document.createElement("br"));
		// cell.innerHTML = "<div id = 'mydiv' style = 'background-color: green'><br></div>";
		// cell.innerHTML = "<div id = 'mydiv' style.visibility = 'hidden'>aaa<br></div>";
		// var mydiv = document.getElementById("mydiv");
		// mydiv.style.cssText  = "visibility : hidden";
		// cell.innerHTML = "&nbsp";
		// cell.innerHTML = "<p>a</p>";
	}
}

function displayForm() {
	// alert("length " + this.parentNode.parentNode.children.length);
	// " inner " + this.innerHTML);
	document.getElementById("coverDiv").style.visibility = "visible";
	var formDiv = document.getElementById("formDiv");
	formDiv.style.visibility = "visible";
	currentCell = this;
	var box = document.getElementById("details");
	box.cols = (window.innerWidth * 0.8) / 13;
	var startTime = document.getElementById("startTime");
	var endTime = document.getElementById("endTime");
	document.getElementById("duration").value = "01:00";
	var startHour = currentCell.className;
	var endHour = parseInt(currentCell.className) + 1;

	if (startHour < 9) {
		startTime.value = "0" + startHour + ":00";
		endTime.value = "0" + endHour + ":00";
	} else if (startHour == 9) {
		startTime.value = "0" + startHour + ":00";
		endTime.value = endHour + ":00";
	} else {
		startTime.value = startHour + ":00";
		endTime.value = endHour + ":00";
	}
	// if(overlapCheck()){
	// testOutput.innerHTML = "overlapCheck " + overlapCheck();
	// }
	// testOutput.innerHTML = "getBoundingClientRect() " + currentCell.getBoundingClientRect();
	// testOutput.innerHTML = " parseInt " + parseInt("051:21");
	// alert(screen.availWidth);
	// alert(window.width);
}

function putDataIn(form) {
	var details = form.details.value;
	var startTime = document.getElementById("startTime").value;
	var endTime = document.getElementById("endTime").value;

	var duration = document.getElementById("duration").value;
	var split = duration.split(":");
	durationHour = parseInt(duration);
	durationMinutes = parseInt(split[1]);
	("0" + durationHour).slice(-2);

	if (durationInHours() > 8) {
		durationError.innerText = " Duration must be 8 hours or less. ";
		return;
	}

	if (endTime <= startTime) {
		durationError.innerText = " Appointment has to finish on the same day and can last at most 8 hours. ";
		// durationError.innerText = " End time must be after start time. ";
		return;
	}

	var appointment = document.createElement("div");
	var appointments = document.getElementById("appointments");
	appointments.appendChild(appointment);
	appointment.className = "appointment";
	// appointment.addEventListener("mouseover", displayImages);
	// appointment.addEventListener("mouseout", removeImages);
	appointment.addEventListener('mouseover', mouseEnter(displayImages), true);
	appointment.addEventListener('mouseout', mouseEnter(removeImages), true);
	if (normal === true) {

		appointment.style.left = currentCell.getBoundingClientRect().left + "px";
		appointment.style.top = currentCell.getBoundingClientRect().top + "px";
		appointment.style.width = (currentCell.getBoundingClientRect().right - currentCell.getBoundingClientRect().left) + "px";
		appointment.style.height = ((currentCell.getBoundingClientRect().bottom - currentCell.getBoundingClientRect().top) * durationInHours()) + "px";

	} else {
		// alert(currentEditWidth);
		appointment.style.left = currentEditLeft;
		appointment.style.top = currentEditTop;
		appointment.style.width = currentEditWidth;
		appointment.style.height = currentEditHeight;
		normal = true;
	}
	appointment.setAttribute("data-startTime", startTime);
	appointment.setAttribute("data-endTime", endTime);
	appointment.setAttribute("data-details", details);
	appointment.innerHTML = appointment.getAttribute("data-startTime") + " - " + appointment.getAttribute("data-endTime") + " " + appointment.getAttribute("data-details");
	// appointment.innerHTML = "aaa";
	appointment.style.background = colour.value;

	var rect2;
	rect2 = appointment.getBoundingClientRect();
	// alert("updated appoi " + rect2.left + " " + rect2.right);
	// alert(appointment.innerHTML);
	if (inputIsOk(form)) {
		// alert(currentCell.getBoundingClientRect().top);
		document.getElementById("formDiv").style.visibility = "hidden";
		document.getElementById("coverDiv").style.visibility = "hidden";
		durationError.innerText = "";
		errorText.innerText = "";
		form.details.value = "";
	} else {
		appointments.removeChild(appointment);
	}

}

function durationInHours() {
	var startTime = document.getElementById("startTime").value;
	var endTime = document.getElementById("endTime").value;
	var duration = document.getElementById("duration").value;
	var endSplit = endTime.split(":");
	var startSplit = startTime.split(":");
	durationHour = parseInt(endTime) - parseInt(startTime);
	durationMinutes = parseInt(endSplit[1]) - parseInt(startSplit[1]);
	return durationHour + (durationMinutes / 60);
}

function inputIsOk(form) {
	var details = form.details.value;
	var startTime = document.getElementById("startTime").value;
	var endTime = document.getElementById("endTime").value;
	var duration = document.getElementById("duration").value;
	var errorText = document.getElementById("errorText");
	if (details == "") {
		errorText.innerText = "Must enter details. ";
	}
	if (duration == "") {
		durationError.innerText = " Must enter duration. ";
	}
	if (endTime == "") {
		durationError.innerText = " Must enter duration. ";
	}
	return details != "" && startTime != "" && endTime != "" && noOverlap();
	// return details != "" && duration != "" && noOverlap();
}

function noOverlap() {
	var duration = document.getElementById("duration").value;
	durationHour = parseInt(duration);
	var errorText = document.getElementById("errorText");
	var appointments = document.getElementById("appointments");
	var rect1 = appointments.lastChild.getBoundingClientRect();
	var rect2;
	rect2 = appointments.children[0].getBoundingClientRect();
	// alert(rect2.left + " " + rect2.right);
	// alert(rect1.left+" "+rect1.right);
	// alert(appointments.children[0]);
	// alert(appointments.children.length);
	for (var i = 0; i < appointments.children.length - 1; i++) {

		// alert(appointments.children.length);
		rect2 = appointments.children[i].getBoundingClientRect();

		// alert(rect1.left+" "+rect1.right);
		// alert(rect2.left+" "+rect2.right);
		if (rectangleOverlap(rect1, rect2)) {
			errorText.innerText = "This appointment coincides with another appointment. ";
			// (usually a later appointment)
			return false;
		}
	};
	return true;
}

function rectangleOverlap(rect1, rect2) {
	var overlap = !(rect1.right <= rect2.left || rect1.left >= rect2.right || rect1.bottom <= rect2.top || rect1.top >= rect2.bottom);
	// testOutput.innerHTML = testOutput.innerHTML + " rect1.right < rect2.left " + (rect1.right < rect2.left);
	// testOutput.innerHTML = testOutput.innerHTML + " rect1.bottom < rect2.top " + (rect1.bottom < rect2.top);
	// testOutput.innerHTML = testOutput.innerHTML + " rect1.left > rect2.right " + (rect1.left > rect2.right);
	// testOutput.innerHTML = testOutput.innerHTML + " rect1.top > rect2.bottom " + (rect1.top > rect2.bottom);
	// alert("rect1.bottom" + rect1.bottom + "rect1.top" + rect1.top);
	// alert("rect2.bottom" + rect2.bottom + "rect2.top" + rect2.top);
	// alert("Overlap "+overlap);
	return overlap;
}

function closeForm(form) {
	document.getElementById("coverDiv").style.visibility = "hidden";
	document.getElementById("formDiv").style.visibility = "hidden";
	durationError.innerText = "";
	errorText.innerText = "";
	form.details.value = "";
}

function displayImages() {
	// var startTime;
	// document.getElementById("pageTest").innerHTML = '<span class="pencil_icon" id="edit" onclick="alert()"></span><button onclick="alert()"></button><p>aaaaa' + '<input type="button" value="button text" onclick="test()"/>';
	// alert(this.getAttribute("data-details"));
	// alert(document.getElementById("testOutput").innerHTML);
	// this.innerHTML = this.innerHTML + '<span class="pencil_icon" id="edit" onclick="editAppointment(this.parentNode)"></span>';
	this.innerHTML = this.getAttribute("data-startTime") + " - " + this.getAttribute("data-endTime") + " " + this.getAttribute("data-details") + '<span class="pencil_icon" id="edit" onclick="editAppointment(this.parentNode)"></span> <span class="x_icon" id="close" onclick="removeAppointment(this.parentNode)"></span>';
	// this.innerHTML = this.getAttribute("data-startTime") + " - " + this.getAttribute("data-endTime") + " " + this.getAttribute("data-details")  + '<img align="right" class="pencil_icon" id="edit" onclick="alert()"></span>';
	// var pencil = document.createElement("img");
	// pencil.href = "pencil20.png";
	// appointment.appendChild(pencil);
	// alert(this.innerHTML);
}

function removeImages() {
	this.innerHTML = this.getAttribute("data-startTime") + " - " + this.getAttribute("data-endTime") + " " + this.getAttribute("data-details");
	// alert("mouse out");
}

function mouseEnter(_fn) {
	return function(_evt) {
		var relTarget = _evt.relatedTarget;
		if (this === relTarget || isAChildOf(this, relTarget)) {
			return;
		}

		_fn.call(this, _evt);
	};
}

function isAChildOf(_parent, _child) {
	if (_parent === _child) {
		return false;
	}
	while (_child && _child !== _parent) {
		_child = _child.parentNode;
	}

	return _child === _parent;
}

function editAppointment(appointment) {
	// alert(appointment.innerHTML);
	currentCell = appointment;

	currentEditLeft = currentCell.getBoundingClientRect().left + "px";
	currentEditTop = currentCell.getBoundingClientRect().top + "px";
	currentEditWidth = (currentCell.getBoundingClientRect().right - currentCell.getBoundingClientRect().left) + "px";
	currentEditHeight = ((currentCell.getBoundingClientRect().bottom - currentCell.getBoundingClientRect().top) * durationInHours()) + "px";

	var appointments = document.getElementById("appointments");
	appointments.removeChild(appointment);
	// appointment.parentNode.removeChild(appointment);
	var box = document.getElementById("details");
	box.cols = (window.innerWidth * 0.8) / 13;
	var startTime = document.getElementById("startTime");
	var endTime = document.getElementById("endTime");
	startTime.value = appointment.getAttribute("data-startTime");
	// alert("here");
	endTime.value = appointment.getAttribute("data-endTime");
	box.value = appointment.getAttribute("data-details");
	// document.getElementById("duration").value = appointment.get;
	// var startHour = currentCell.className;
	// var endHour = parseInt(currentCell.className) + 1;

	document.getElementById("coverDiv").style.visibility = "visible";
	var formDiv = document.getElementById("formDiv");
	formDiv.style.visibility = "visible";

	var rect2 = appointments.children[0].getBoundingClientRect();
	normal = false;
	// alert(rect2.left + " " + rect2.right);

	// alert(appointments.children.length);
	// appointment.removeChild(pencil);
	// alert("image clicked " + appointment.innerHTML);
}

function removeAppointment(appointment) {
	appointment.parentNode.removeChild(appointment);
	// alert("image clicked " + appointment.innerHTML);
}

function test() {
	alert("here");
}

function empty() {

}

function createOutsideTable() {
	// alert("hello");
	var main = document.getElementById("main");
	var table = document.createElement("table");
	main.appendChild(table);
	table.style.width = '100%';
	table.style.border = "1px solid black";
	var row = document.createElement("tr");
	table.appendChild(row);
	var cell = document.createElement("td");
	row.appendChild(cell);
	createHoursTable(cell);
	for (var i = 0; i < 7; i++) {

	}

	// cell.innerHTML = "aaimg";
	var tuesday = document.getElementById("tuesday");
	td.innerHTML = "aaa";
	tuesday.appendChild(tbl);
}

function tableCreate() {
	var main = document.getElementById("main");
	var tbl = document.createElement('table');
	tbl.style.width = '100%';
	tbl.style.border = "1px solid black";

	var tr = tbl.insertRow();
	main.appendChild(tbl);
	for (var i = 0; i < 7; i++) {

		var td;
		tr.appendChild(td);
		td.innerHTML = "bbb";
		// createDayTable();
	}

	//
	// // tr.appendChild(td);
	// td = tr.insertCell();
	//
	// innerTable = document.createElement('table');
	// // innerTable.style.border = "1px solid black";
	//
	// row = document.createElement('tr');
	// innerTable.appendChild(row);
	// var heading = document.createElement('th');
	// // cell = row.insertCell();
	// row.appendChild(heading);
	// heading.style.border = "1px solid black";
	// heading.innerHTML = "Start Hour";
	// for (var j = 0; j < 24; j++) {
	// row = document.createElement('tr');
	// innerTable.appendChild(row);
	// // row = innerTable.insertRow();
	// cell = row.insertCell();
	// cell.style.border = "1px solid black";
	// // cell.appendChild(document.createTextNode(j + ":"));
	// cell.innerHTML = j + ":00";
	// }
	// td.appendChild(innerTable);

}

function createDayTable() {

	// var td;
	// tr.appendChild(td);
	// var td = tr.insertCell();

	for ( j = 0; j < 24; j++) {
		var row = document.createElement('tr');
		innerTable.appendChild(row);
		var cell = row.insertCell();
		cell.style.border = "1px solid black";
		cell.innerHTML = "aaa";
	}
	td.appendChild(innerTable);
}
