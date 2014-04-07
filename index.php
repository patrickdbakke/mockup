<?php $fromIndex=true;?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>mockup</title>
		<link rel="stylesheet" type="text/css" href="/assets/css/site.css" />
		<script type="text/javascript" src="/assets/js/jquery.min.js" id="jquery"></script>
		<script type="text/javascript" src="/assets/js/modernizr-2.6.2.min.js"></script>
		<script type="text/javascript" src="/assets/js/underscore.min.js"></script>
		<script type="text/javascript" src="/assets/js/backbone.min.js"></script>
		<script type="text/javascript" src="/assets/js/backbone.marionette.min.js"></script>
	</head>
	<body class="">
		<div id="content"></div>
	</body>
	<footer>
		<?php include "app/templates.php"; ?>
		<?php include "app/views.php"; ?>	
		<?php include "app/models.php"; ?>
		<script type="text/javascript" src="/app/app.js"></script>
	</footer>
</html>