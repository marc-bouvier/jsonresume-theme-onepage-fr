var fs = require("fs");
var Handlebars = require("handlebars");
var moment = require("moment")

// Date format
var DateFormats = {
    monthYear: "MMMM YYYY"
};

Handlebars.registerHelper("formatDate", function (datetime, format) {
    if (moment) {
        // can use other formats like 'lll' too
        format = DateFormats[format] || format;
        moment.locale("fr")
        return moment(datetime).format(format);
    } else {
        return datetime;
    }
});

COURSES_COLUMNS = 3;

function validateArray(arr) {
    return arr !== undefined && arr !== null && arr instanceof Array && arr.length > 0;
}

function render(resume) {
    // Split courses into 3 columns
    if (validateArray(resume.education)) {
        resume.education.forEach(function (block) {
            if (validateArray(block.courses)) {
                splitCourses = [];
                columnIndex = 0;
                for (var i = 0; i < COURSES_COLUMNS; i++) {
                    splitCourses.push([]);
                }
                block.courses.forEach(function (course) {
                    splitCourses[columnIndex].push(course);
                    columnIndex++;
                    if (columnIndex >= COURSES_COLUMNS) {
                        columnIndex = 0;
                    }
                });
                block.courses = splitCourses;
            }
        });
    }

    var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
    var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
    return Handlebars.compile(tpl)({
        css: css,
        resume: resume
    });
}

module.exports = {
    render: render
};
