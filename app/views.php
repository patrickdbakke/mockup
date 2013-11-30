<?php
	if(isset($fromIndex)){
		echo '<script src="/app/views.js"></script>';
	}else{
		header("Content-type: application/javascript");
		foreach (glob("views/*.js") as $filename)
		{
			include $filename;
		}
	}
?>