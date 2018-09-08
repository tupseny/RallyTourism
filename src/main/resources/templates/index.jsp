<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org/">
<head>
    <meta charset="UTF-8">
    <title>Start page</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="js/tools.js"></script>
    <script type="application/javascript" src="js/main.js"></script>
</head>
<body>
<p th:text="'This is start page'"></p>

<!--Debugging button. Stress test-->
<input type="number" id="stress-num">
<button type="button" th:text="'Stress test'" onclick="stressTest($('#stress-num').val())"></button>

<div>
    <div class="new-insertion-form">
        <form class="input-new-insertion" id="input-new-form">
            <input id="new-insertion-name" type="text" placeholder="Name" name="name">
            <input id="new-insertion-surname" type="text" placeholder="Surname" name="surname">
            <button th:text="Add" type="submit"></button>
            <button th:text="Reset" type="reset"></button>
        </form>
    </div>
    <div class="table-get-all">
        <button th:text="'Update'" onclick="updateTable()"></button>
        <!--Debugging button. Reset-->
        <button th:text="'Clear'" onclick="$.post('player/remove-all')"></button>
        <table id="table-get-all-players">
        </table>
    </div>
</div>
</body>
</html>