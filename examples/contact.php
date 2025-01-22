<!doctype html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Kontakt</title>
    <link rel="icon" type="image/x-icon" href="/assets/logo_filled_round-back.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="/assets/colombia/colombia.css" />
    <link rel="stylesheet" href="/assets/Montserrat/Montserrat.css">
    <script src="https://kit.fontawesome.com/75ba8da246.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="/scss/styles.css" />
</head>

<body class="contact">
    <?php include realpath(__DIR__ . '/../config.php'); ?>

    <?php
    include PROJECT_ROOT . '/partials/navbar.php';
    ?>
    
    <main>
        <section class="contact-hero">
            <h1>Kontaktieren Sie uns</h1>
            <p>Wir freuen uns darauf, von Ihnen zu hören. Sie können uns gerne über das Formular kontaktieren, uns direkt eine E-Mail schreiben oder anrufen. Bei E-Mails und Kontaktformular-Anfragen melden wir uns so schnell wie möglich bei Ihnen zurück. Telefonisch sind wir natürlich direkt für Sie erreichbar.</p>
            <div class="rounded bottom" style="background-color: #29b597;"></div>
        </section>

        <!-- contact-section -->

        <section class="contact-section">
            <div class="card">
                <h2>Kontaktieren Sie uns</h2>
                <div class="contact-informations">
                    <h3 style="color:white;">Email: <a style="color:white;" href="mailto:info@absolutenetwork.de:">info@absolutenetwork.de</a></h3>
                    <h3 style="color:white;">Telefon: <a style="color:white;" href="tel:+4915256932840">+4915256932840</a></h3>
                    <h3 style="color:white;">Adresse: <a style="color:white;" href="https://maps.app.goo.gl/7uXHXY48uFYyvBmz8">Baumstraße 3, 49074 Osnabrück</a></h3>
                </div>
                <!-- Änderungen im Kontaktformular -->
                <form id="contactForm" action="/process_form.php" method="post">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label>Vorname</label>
                                <input type="text" name="firstname" required>
                            </div>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <label>Nachname</label>
                                <input type="text" name="lastname" required>
                            </div>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" required>
                            </div>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <label>Telefon</label>
                                <input type="tel" name="phone">
                            </div>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <label>Nachricht</label>
                                <textarea id="message" name="message" required></textarea>
                            </div>
                        </div>

                        <div class="col">
                            <div class="form-group">
                                <label>Interessiert an:</label>
                                <div class="custom-select">
                                    <select name="interest">
                                        <option value="website">Webseite</option>
                                        <option value="app">App</option>
                                        <option value="other">Anderes...</option>
                                    </select>
                                    <img class="dropdown-icon" src="/assets/icons/alt-arrow-down.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="button">Abschicken</button>
                </form>
            </div>
        </section>

        <!-- Google Maps section -->
        <section class="google-maps-section">
            <h2>Hier finden Sie uns</h2>
            <p>Falls Sie uns etwas per Post zusenden möchten, können Sie dies gerne an unsere Adresse in Osnabrück schicken.</p>
            <div class="map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2437.3988326380396!2d8.047072776926815!3d52.27240997201754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e5f3d0c0d6f1%3A0x4f4c76e5c4f4f4f4!2sBaumstra%C3%9Fe%203%2C%2049074%20Osnabr%C3%BCck!5e0!3m2!1sde!2sde!4v1652345678901!5m2!1sde!2sde"
                    width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </section>
    </main>

    <?php
    include PROJECT_ROOT . '/partials/footer.php';
    ?>

    <script src="../js/adjustRoundedElements.js"></script>
    <script src="../js/adjustTextareaHeight.js"></script>
    <script src="../js/handleContactForm.js"></script>
</body>

</html>
