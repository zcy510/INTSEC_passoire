<?php
// Include the database connection
include 'db_connect.php';

// Start the session to track user login status
session_start();

// Initialize an error message variable
$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$login = $_POST['login'];
	$password = $_POST['password'];

	// Check if login and password are provided
	if (!empty($login) && !empty($password)) {
		// Fetch the user from the database using prepared statement
		$stmt = $conn->prepare("SELECT id, pwhash FROM users WHERE login = ?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($result->num_rows > 0) {
			// Fetch the first row of results into an array
			$user = $result->fetch_assoc();
		} else {
			$user = null;
			echo "No results found.";
		}
		$stmt->close();
		// If the user exists and the password matches
		if ($user && (sha1($password) == $user['pwhash'])) {
			// Regenerate session ID to prevent session fixation
            session_regenerate_id(true);
			// Set the session variable
			$_SESSION['user_id'] = $user['id'];
			// Redirect to a different page (e.g., profile.php)
			header('Location: index.php');
			exit();
		} elseif (!($user)) {
			$error = 'Invalid login. Please try again.';
		} else {
			$error = 'Invalid password. Please try again.';
		}
	} else {
		$error = 'Please fill in both fields.';
	}
}
?>

<!DOCTYPE html>
<html>

<head>
	<title>Passoire: A simple file hosting server</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="./style/w3.css">
	<link rel="stylesheet" href="./style/w3-theme-blue-grey.css">
	<link rel="stylesheet" href="./style/css/fontawesome.css">
	<link href="./style/css/brands.css" rel="stylesheet" />
	<link href="./style/css/solid.css" rel="stylesheet" />
	<style>
		html,
		body,
		h1,
		h2,
		h3,
		h4,
		h5 {
			font-family: "Open Sans", sans-serif
		}

		.center-c {
			margin-bottom: 25px;
			padding-bottom: 25px;
		}
	</style>
</head>

<body class="w3-theme-l5">
	<?php include 'navbar.php'; ?>



	<!-- Page Container -->
	<div class="w3-container w3-content" style="max-width:1400px;margin-top:80px">


		<!-- The Grid -->
		<div class="w3-row">
			<div class="w3-col m12">



				<div class="w3-card w3-round">
					<div class="w3-container w3-center center-c">
						<h2>Login</h2>

						<?php if ($error): ?>
							<p class="error"><?php echo $error; ?></p>
						<?php endif; ?>

						<form action="connexion.php" method="post">
							<input type="text" class="w3-border w3-padding w3-margin" name="login" placeholder="Login"
								required><br />
							<input type="password" class="w3-border w3-padding w3-margin" name="password"
								placeholder="Password" required><br />
							<button type="submit" class="w3-button w3-theme w3-margin">Login</button><br />
						</form>

						<p>Don't have a login yet? <a href="signup.php"> Sign up here!</a></p>
					</div>
				</div>


			</div>
		</div>
	</div>
</body>

</html>