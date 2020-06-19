// Store when certain pages begin animation so that they don't repeat if the user navigates back and forth between them.
var animations = [
	{ name: "mario", started: false },
	{ name: "tetris", started: false },
	{ name: "zelda", started: false },
	{ name: "megaman", started: false }
];


$(document).ready(function() {

	// Process any keypress on the page and navigate forward or backward if the left or right key was pressed.
	document.onkeydown = processKeypress;

	// Show a loading screen where coins animate fade in, wait five seconds for all images to load, fade out the load screen, fade up the main site, and create waypoints to start animations.
	fadeInElements($("[name = 'loading-coin']"), 0, 500, startResume);

	// The controller divs control the fading between the four pages.  Since the controller divs might not be in the DOM when the pages appear, add a click handler to the document so that it gets added when it does exist.
	$(document).on("click", "#controller-left", function() {
		previousPage();
	});

	$(document).on("click", "#controller-right", function() {
		nextPage();
	});
});


// Scroll from the current position to the top of the page in a smooth animation.
function scrollToTop() {

	var position = document.documentElement.scrollTop || document.body.scrollTop;

	if (position > 0) {
		window.requestAnimationFrame(scrollToTop);
		window.scrollTo(0, position - position / 8);	// 8 is the rate of animated scrolling.  Increase for slower rate.
	}
};


// Process keypress and navigate pages if the left or right arrows are pressed.
function processKeypress(inputEvent) {

    inputEvent = inputEvent || window.event;

    if (inputEvent.keyCode == '38') {} 		// Up arrow.
    else if (inputEvent.keyCode == '40') {} // Down arrow.
    else if (inputEvent.keyCode == '37') {	// Left arrow.
       previousPage();
    }
    else if (inputEvent.keyCode == '39') {	// Right arrow.
       nextPage();
    }
}


// Navigate to the next page based on the current page that is visible (Mario => Tetris => Zelda => Megaman).  Determine the current page depending on what is visible.
function nextPage() {

	var marioContainer = $("#mario-container");
	var tetrisContainer = $("#tetris-container");
	var zeldaContainer = $("#zelda-container");
	var megamanContainer = $("#megaman-container");

	if (marioContainer && tetrisContainer && marioContainer.css("opacity") == 1 && tetrisContainer.css("opacity") == 0) {

		marioContainer.fadeTo(1000, 0, function() {

			// Take the container out of the DOM so that invisible elements from it are not interfering with visible elements.  FadeOut above does not seem to do it.
			marioContainer.css("display", "none");

			scrollToTop();
			tetrisContainer.fadeTo(1000, 1, function() {

				$.each(animations, function(index, element) {
					if (element.name == "tetris" && !element.started) {

						startTetrisAnimations();
						element.started = true;
						return false;
					}
				});
			});
		});
	}

	else if (tetrisContainer && zeldaContainer && tetrisContainer.css("opacity") == 1 && zeldaContainer.css("opacity") == 0) {

		tetrisContainer.fadeTo(1000, 0, function() {

			// Take the container out of the DOM so that invisible elements from it are not interfering with visible elements.  FadeOut above does not seem to do it.
			tetrisContainer.css("display", "none");

			scrollToTop();
			zeldaContainer.fadeTo(1000, 1, function() {

				$.each(animations, function(index, element) {
					if (element.name == "zelda" && !element.started) {

						startZeldaAnimations();
						element.started = true;
						return false;
					}
				});
			});
		});
	}

	else if (zeldaContainer && megamanContainer && zeldaContainer.css("opacity") == 1 && megamanContainer.css("opacity") == 0) {

		zeldaContainer.fadeTo(1000, 0, function() {

			// Take the container out of the DOM so that invisible elements from it are not interfering with visible elements.  FadeOut above does not seem to do it.
			zeldaContainer.css("display", "none");

			scrollToTop();
			megamanContainer.fadeTo(1000, 1, function() {

				$.each(animations, function(index, element) {
					if (element.name == "megaman" && !element.started) {

						startMegamanAnimations();
						element.started = true;
						return false;
					}
				});
			});
		});
	}
}


// Navigate to the previous page based on the current page (Mario => Tetris => Zelda => Megaman).  Determine the current page depending on what is visible.
function previousPage() {
	
	var marioContainer = $("#mario-container");
	var tetrisContainer = $("#tetris-container");
	var zeldaContainer = $("#zelda-container");
	var megamanContainer = $("#megaman-container");

	if (marioContainer && tetrisContainer && tetrisContainer.css("opacity") == 1 && marioContainer.css("opacity") == 0){

		tetrisContainer.fadeTo(1000, 0, function() {

			// Take the container out of the DOM so that invisible elements from it are not interfering with visible elements.  FadeOut above does not seem to do it.
			tetrisContainer.css("display", "none");

			scrollToTop();
			marioContainer.fadeTo(1000, 1);
		});
	}

	else if (tetrisContainer && zeldaContainer && zeldaContainer.css("opacity") == 1 && tetrisContainer.css("opacity") == 0) {

		zeldaContainer.fadeTo(1000, 0, function() {

			// Take the container out of the DOM so that invisible elements from it are not interfering with visible elements.  FadeOut above does not seem to do it.
			zeldaContainer.css("display", "none");

			scrollToTop();
			tetrisContainer.fadeTo(1000, 1);
		});
	}

	else if (zeldaContainer && megamanContainer && megamanContainer.css("opacity") == 1 && zeldaContainer.css("opacity") == 0) {

		megamanContainer.fadeTo(1000, 0, function() {

			// Take the container out of the DOM so that invisible elements from it are not interfering with visible elements.  FadeOut above does not seem to do it.
			megamanContainer.css("display", "none");

			scrollToTop();
			zeldaContainer.fadeTo(1000, 1);
		});
	}
}


// Delay the fading out for a second after the final coin loads in, and then fade up the resume a second later.  Create the waypoints that begin the animations.
function startResume() {

	// The loading screen should be taken out of the DOM so that the resume container can move up, so do a fadeOut and not a fadeTo.
	$("#loading-screen").fadeOut(1000, function() {

		$("#main").fadeIn(1000, function() {
			startMarioAnimations();

			// Deactivate the mario animations from future starting.
			$.each(animations, function(index, element) {
				if (element.name == "mario" && !element.started) {
					element.started = true;
					return false;
				}
			});
		});
	});
}


// Start the animations for the Mario page, which are several typewriter texts and a repeat fading cursor.
function startMarioAnimations() {

	// Create typewriter objects.  The typewriters can only work on a single div on creation, which makes unfortunately many typewriters needing to be created.
	var typeWriterOptions = {
		autoStart: false,
		cursor: "",
		delay: 50
	};

	var typeWriterMarioHello =			new Typewriter("#mario-text-hello", typeWriterOptions);
	var typeWriterMarioDescription0 =	new Typewriter("#mario-text-description-0", typeWriterOptions);
	var typeWriterMarioDescription1 =	new Typewriter("#mario-text-description-1", typeWriterOptions);
	var typeWriterMarioDescription2 =	new Typewriter("#mario-text-description-2", typeWriterOptions);
	var typeWriterMarioDescription3 =	new Typewriter("#mario-text-description-3", typeWriterOptions);
	var typeWriterMarioStart =			new Typewriter("#mario-text-start", typeWriterOptions);

	// The typewriter objects can only be sequenced in callbacks after the typewriter finishes.  This creates an insane callback hell, but it is unavoidable.
	typeWriterMarioHello.typeString("Hello!  My name is")
	.start()
	.pauseFor(250)
	.callFunction(function() {
		$("#mario-image-name").fadeTo(250, 1);
	})
	.pauseFor(2000)
	.callFunction(function() {

		typeWriterMarioDescription0.typeString("and I love to write")
		.start()
		.callFunction(function() {

			typeWriterMarioDescription1.typeString("great code and make great")
			.start()
			.callFunction(function() {

				typeWriterMarioDescription2.typeString("hardware to create")
				.start()
				.callFunction(function() {

					typeWriterMarioDescription3.typeString("awesome experiences!")
					.start()
					.callFunction(function() {

						typeWriterMarioStart.typeString("start resume")
						.start()
						.callFunction(function() {
							$("#mario-image-cursor").css("display", "");
							$("#mario-image-cursor").addClass("blink");
						});
					});
				});
			});
		});
	});
}


// Start the animations for the Tetris page, which are several typewriter texts and then tetris blocks animating down from a container top down to a skill row, and then a row of blocks fading in to show a rating for that skill.
// The block animations were getting long enough that they were broken out into two separate functions.
function startTetrisAnimations() {

	// Create typewriter objects.  The typewriters can only work on a single div on creation, which makes unfortunately many typewriters needing to be created.
	var typeWriterOptions = {
		autoStart: false,
		cursor: "",
		delay: 50
	};

	var typeWriterTetrisSkills =	new Typewriter("#tetris-text-skills", typeWriterOptions);
	var typeWriterTetrisSubtitle0 =	new Typewriter("#tetris-text-subtitle-0", typeWriterOptions);
	var typeWriterTetrisSubtitle1=	new Typewriter("#tetris-text-subtitle-1", typeWriterOptions);
	var typeWriterTetrisSubtitle2 =	new Typewriter("#tetris-text-subtitle-2", typeWriterOptions);

	// The typewriter objects can only be sequenced in callbacks after the typewriter finishes.  This creates an insane callback hell, but it is unavoidable.
	typeWriterTetrisSkills.typeString("Skills")
	.start()
	.pauseFor(250)
	.callFunction(function() {

		typeWriterTetrisSubtitle0.typeString("I enjoy learning new")
		.start()
		.callFunction(function() {

			typeWriterTetrisSubtitle1.typeString("technologies to add to my")
			.start()
			.callFunction(function() {

				typeWriterTetrisSubtitle2.typeString("skills toolbox.")
				.start()
				.pauseFor(250)
				.callFunction(function() {
					startDomainsAnimations();
				});
			});
		});
	});		
}


// To sequence the animations, it needs to be known which animation events to attach to.  However, different browsers have multiple events they can attach to, and including
// all browser event types can lead to animations repeating when they should not.  Instead, detect the exact animation end event type that the browser is using and use that
// to attach animation completion events to.
function getAnimationEventType(inputElement){

	var animationType = "";

	// Enumerate the browser animation events of interest and their corresponding event ending.
	var animations = {
		"animation"      : "animationend",
		"OAnimation"     : "oAnimationEnd",
		"MozAnimation"   : "animationend",
		"WebkitAnimation": "webkitAnimationEnd"
	}

	// Search for the animation type in the event and then return the corresponding ending animation type.
	for (animationType in animations){
		if (inputElement.style[animationType] !== undefined){
			return animations[animationType];
		}
	}
}


// Start the block animations for the domain container.  The animations are defined in keyframes in the main css file.
function startDomainsAnimations() {

	// Create typewriter objects.  The typewriters can only work on a single div on creation, which makes unfortunately many typewriters needing to be created.
	var typeWriterOptions = {
		autoStart: false,
		cursor: "",
		delay: 50
	};

	var typeWriterTetrisDomains =	new Typewriter("#tetris-text-domains", typeWriterOptions);
	var typeWriterTetrisStack0 =	new Typewriter("#tetris-text-stack-0", typeWriterOptions);
	var typeWriterTetrisStack1 =	new Typewriter("#tetris-text-stack-1", typeWriterOptions);
	var typeWriterTetrisEmbedded0 =	new Typewriter("#tetris-text-embedded-0", typeWriterOptions);
	var typeWriterTetrisEmbedded1 =	new Typewriter("#tetris-text-embedded-1", typeWriterOptions);
	var typeWriterTetrisServer0 =	new Typewriter("#tetris-text-server-0", typeWriterOptions);
	var typeWriterTetrisServer1 =	new Typewriter("#tetris-text-server-1", typeWriterOptions);
	var typeWriterTetrisSoftware0 =	new Typewriter("#tetris-text-software-0", typeWriterOptions);
	var typeWriterTetrisSoftware1 =	new Typewriter("#tetris-text-software-1", typeWriterOptions);
	var typeWriterTetrisDesign0 =	new Typewriter("#tetris-text-design-0", typeWriterOptions);
	var typeWriterTetrisDesign1 =	new Typewriter("#tetris-text-design-1", typeWriterOptions);
	var typeWriterTetrisHardware0 =	new Typewriter("#tetris-text-hardware-0", typeWriterOptions);
	var typeWriterTetrisHardware1 =	new Typewriter("#tetris-text-hardware-1", typeWriterOptions);	

	// The rhythm of the animations is that an escape block is first faded in at the top of the container, animated down to its Y position via CSS keyframes over decreasing times, and the corresponding row of 20 squares is faded in next to it.
	typeWriterTetrisDomains.typeString("Domains")
	.start()
	.pauseFor(250)
	.callFunction(function() {

		$("#tetris-next-block-hardware").fadeTo(250, 1).queue(function() {

			var $this = $(this);

			// Add the keyframe class to start the animation.
			$this.addClass("next-block-animation-hardware");

			typeWriterTetrisHardware0.typeString("Hardware")
			.start()
			.pauseFor(250)
			.callFunction(function() {
				typeWriterTetrisHardware1.typeString("engineering")
				.start();
			});

			// A callback after the keyframe animation is complete is used to start the animation of the next skill.  The .one() will only perform the binding function once and then unbind itself, which is desired since the animations should only run once.
			$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

				// Fade in the row of blocks for this skill.
				fadeInElements($("[id ^= 'tetris-block-hardware-']"), 50, 50);

				$("#tetris-next-block-design").fadeTo(250, 1).queue(function() {

					// Hide the last block.
					$("#tetris-next-block-hardware").hide();

					var $this = $(this);

					$this.addClass("next-block-animation-design");

					typeWriterTetrisDesign0.typeString("Design: UI/UX")
					.start()
					.pauseFor(250)
					.callFunction(function() {
						typeWriterTetrisDesign1.typeString("and graphic")
						.start();
					});

					$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

						fadeInElements($("[id ^= 'tetris-block-design-']"), 50, 50);

						$("#tetris-next-block-software").fadeTo(250, 1).queue(function() {

							// Hide the last block.
							$("#tetris-next-block-design").hide();

							var $this = $(this);

							$this.addClass("next-block-animation-software");

							typeWriterTetrisSoftware0.typeString("Software")
							.start()
							.pauseFor(250)
							.callFunction(function() {
								typeWriterTetrisSoftware1.typeString("engineering")
								.start();
							});

							$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

								fadeInElements($("[id ^= 'tetris-block-software-']"), 50, 50);

								$("#tetris-next-block-server").fadeTo(250, 1).queue(function() {

									// Hide the last block.
									$("#tetris-next-block-software").hide();

									var $this = $(this);

									$this.addClass("next-block-animation-server");

									typeWriterTetrisServer0.typeString("Server")
									.start()
									.pauseFor(250)
									.callFunction(function() {
										typeWriterTetrisServer1.typeString("administ.")
										.start();
									});

									$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

										fadeInElements($("[id ^= 'tetris-block-server-']"), 50, 50);

										$("#tetris-next-block-embedded").fadeTo(250, 1).queue(function() {

											// Hide the last block.
											$("#tetris-next-block-server").hide();

											var $this = $(this);

											$this.addClass("next-block-animation-embedded");

											typeWriterTetrisEmbedded0.typeString("Embedded")
											.start()
											.pauseFor(250)
											.callFunction(function() {
												typeWriterTetrisEmbedded1.typeString("programming")
												.start();
											});

											$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

												fadeInElements($("[id ^= 'tetris-block-embedded-']"), 50, 50);

												$("#tetris-next-block-stack").fadeTo(250, 1).queue(function() {

													// Hide the last block.
													$("#tetris-next-block-embedded").hide();

													var $this = $(this);

													$this.addClass("next-block-animation-stack");

													typeWriterTetrisStack0.typeString("Full-stack")
													.start()
													.pauseFor(250)
													.callFunction(function() {
														typeWriterTetrisStack1.typeString("programming")
														.start();
													});

													$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

														// Hide the last block.
														$("#tetris-next-block-stack").hide();

														fadeInElements($("[id ^= 'tetris-block-stack-']"), 50, 50);

														// Start the animations for the technologies frame.
														startTechnologiesAnimations();
													});
												});
											});
										});						
									});
								});
							});
						});
					});
				});
			});
		});
	});
}


// Start the block animations for the technologies container.  The animations are defined in keyframes in the main css file.
function startTechnologiesAnimations() {

	// Create typewriter objects.  The typewriters can only work on a single div on creation, which makes unfortunately many typewriters needing to be created.
	var typeWriterOptions = {
		autoStart: false,
		cursor: "",
		delay: 50
	};

	var typeWriterTetrisTechnologies =	new Typewriter("#tetris-text-technologies", typeWriterOptions);
	var typeWriterTetrisC =				new Typewriter("#tetris-text-c", typeWriterOptions);
	var typeWriterTetrisJava =			new Typewriter("#tetris-text-java", typeWriterOptions);
	var typeWriterTetrisPython =		new Typewriter("#tetris-text-python", typeWriterOptions);
	var typeWriterTetrisJs =			new Typewriter("#tetris-text-js", typeWriterOptions);
	var typeWriterTetrisHtml =			new Typewriter("#tetris-text-html", typeWriterOptions);
	var typeWriterTetrisColdfusion =	new Typewriter("#tetris-text-coldfusion", typeWriterOptions);
	var typeWriterTetrisSql =			new Typewriter("#tetris-text-sql", typeWriterOptions);
	var typeWriterTetrisUnix =			new Typewriter("#tetris-text-unix", typeWriterOptions);
	var typeWriterTetrisArduino =		new Typewriter("#tetris-text-arduino", typeWriterOptions);
	var typeWriterTetrisEagle =			new Typewriter("#tetris-text-eagle", typeWriterOptions);

	// The rhythm of the animations is that an escape block is first faded in at the top of the container, animated down to its Y position via CSS keyframes over decreasing times, and the corresponding row of 20 squares is faded in next to it.
	typeWriterTetrisTechnologies.typeString("Technologies")
	.start()
	.pauseFor(250)
	.callFunction(function() {

		$("#tetris-next-block-eagle").fadeTo(250, 1).queue(function() {

			var $this = $(this);

			// Add the keyframe class to start the animation.
			$this.addClass("next-block-eagle");

			typeWriterTetrisEagle.typeString("Eagle PCB")
			.start();

			// A callback after the keyframe animation is complete is used to start the animation of the next skill.  The .one() will only perform the binding function once and then unbind itself, which is desired since the animations should only run once.
			$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

				// Fade in the row of blocks for this skill.
				fadeInElements($("[id ^= 'tetris-block-eagle-']"), 50, 50);

				$("#tetris-next-block-arduino").fadeTo(250, 1).queue(function() {

					// Hide the last block.
					$("#tetris-next-block-eagle").hide();

					var $this = $(this);

					$this.addClass("next-block-arduino");

					typeWriterTetrisArduino.typeString("Arduino")
					.start();

					$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

						fadeInElements($("[id ^= 'tetris-block-arduino-']"), 50, 50);

						$("#tetris-next-block-unix").fadeTo(250, 1).queue(function() {

							// Hide the last block.
							$("#tetris-next-block-arduino").hide();

							var $this = $(this);

							$this.addClass("next-block-unix");

							typeWriterTetrisUnix.typeString("UNIX/Linux")
							.start();

							$(this).one(getAnimationEventType(document.getElementById($(this).attr("id"))), function() {

								fadeInElements($("[id ^= 'tetris-block-unix-']"), 50, 50);

								$("#tetris-next-block-sql").fadeTo(250, 1).queue(function() {

									// Hide the last block.
									$("#tetris-next-block-unix").hide();

									var $this = $(this);

									$this.addClass("next-block-sql");

									typeWriterTetrisSql.typeString("SQL/Oracle")
									.start();

									$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

										fadeInElements($("[id ^= 'tetris-block-sql-']"), 50, 50);

										$("#tetris-next-block-coldfusion").fadeTo(250, 1).queue(function() {

											// Hide the last block.
											$("#tetris-next-block-sql").hide();

											var $this = $(this);

											$this.addClass("next-block-coldfusion");

											typeWriterTetrisColdfusion.typeString("ColdFusion/PHP")
											.start();

											$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

												fadeInElements($("[id ^= 'tetris-block-coldfusion-']"), 50, 50);

												$("#tetris-next-block-html").fadeTo(250, 1).queue(function() {

													// Hide the last block.
													$("#tetris-next-block-coldfusion").hide();

													var $this = $(this);

													$this.addClass("next-block-html");

													typeWriterTetrisHtml.typeString("HTML/CSS")
													.start();

													$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

														fadeInElements($("[id ^= 'tetris-block-html-']"), 50, 50);

														$("#tetris-next-block-js").fadeTo(250, 1).queue(function() {

															// Hide the last block.
															$("#tetris-next-block-html").hide();

															var $this = $(this);

															$this.addClass("next-block-js");

															typeWriterTetrisJs.typeString("JS/jQuery")
															.start();

															$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

																fadeInElements($("[id ^= 'tetris-block-js-']"), 50, 50);

																$("#tetris-next-block-python").fadeTo(250, 1).queue(function() {

																	// Hide the last block.
																	$("#tetris-next-block-js").hide();

																	var $this = $(this);

																	$this.addClass("next-block-python");

																	typeWriterTetrisPython.typeString("Python")
																	.start()
																	.callFunction(function() {

																		// Fade in the Q-Bert snake next to the Python text string.
																		$("#tetris-snake").fadeTo(250, 1);
																	});

																	$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

																		fadeInElements($("[id ^= 'tetris-block-python-']"), 50, 50);

																		$("#tetris-next-block-java").fadeTo(250, 1).queue(function() {

																			// Hide the last block.
																			$("#tetris-next-block-python").hide();

																			var $this = $(this);

																			$this.addClass("next-block-java");

																			typeWriterTetrisJava.typeString("Java/C#")
																			.start();

																			$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {

																				fadeInElements($("[id ^= 'tetris-block-java-']"), 50, 50);

																				$("#tetris-next-block-c").fadeTo(250, 1).queue(function() {

																					// Hide the last block.
																					$("#tetris-next-block-java").hide();

																					var $this = $(this);

																					$this.addClass("next-block-c");

																					typeWriterTetrisC.typeString("C/Embedded")
																					.start();

																					$this.one(getAnimationEventType(document.getElementById($this.attr("id"))), function() {
																						fadeInElements($("[id ^= 'tetris-block-c-']"), 50, 50);
																						// Hide the last block.
																						$("#tetris-next-block-c").hide();
																					});
																				});
																			});
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});						
								});
							});
						});
					});
				});
			});
		});
	});	
}


// Helper function to take an array of elements and fade them in with a certain duration of fade, duration between element fades, and a callback to run on completion.
// Fades are not subject to jQuery delay functions, so as each fade is triggered, add an increasing delay to it based on its enumerated turn.
function fadeInElements(inputElements, inputFadeDuration, inputElementDelay, inputCallback) {

	// Keep track of the increasing amount of delay to add to each element.
	var elementDelay = inputElementDelay;

	if (inputElements && inputElements.length && Number.isInteger(inputFadeDuration) && Number.isInteger(inputElementDelay)) {

		$.each(inputElements, function(index, element) {

			setTimeout(function() { $(element).fadeTo(inputFadeDuration, 1); }, elementDelay);

			// Add the between element delay rate to the total delay amount.
			elementDelay += inputElementDelay;

			// If a callback was defined, then call it after the last element is done fading.
			if (inputCallback && (index + 1 == inputElements.length)) {
				setTimeout(inputCallback, elementDelay);
			}				
		});
	}
}


// Start the animations for the Zelda page, which are several sequenced images faded in with typewriter texts.
function startZeldaAnimations() {

	// Create typewriter objects.  The typewriters can only work on a single div on creation, which makes unfortunately many typewriters needing to be created.
	var typeWriterOptions = {
		autoStart: false,
		cursor: "",
		delay: 50
	};

	var typeWriterZeldaTimeline =	new Typewriter("#zelda-text-timeline", typeWriterOptions);
	var typeWriterZeldaSpeech0 =	new Typewriter("#zelda-text-speech-0", typeWriterOptions);
	var typeWriterZeldaSpeech1 =	new Typewriter("#zelda-text-speech-1", typeWriterOptions);
	
	var typeWriterZelda1996 =				new Typewriter("#zelda-text-year-1996", typeWriterOptions);
	var typeWriterZelda1996Description0 =	new Typewriter("#zelda-text-description-1996-0", typeWriterOptions);
	var typeWriterZelda1996Description1 =	new Typewriter("#zelda-text-description-1996-1", typeWriterOptions);
	
	var typeWriterZelda2005 =				new Typewriter("#zelda-text-year-2005", typeWriterOptions);
	var typeWriterZelda2005Description0 =	new Typewriter("#zelda-text-description-2005-0", typeWriterOptions);
	var typeWriterZelda2005Description1 =	new Typewriter("#zelda-text-description-2005-1", typeWriterOptions);
	var typeWriterZelda2005Description2 =	new Typewriter("#zelda-text-description-2005-2", typeWriterOptions);
	var typeWriterZelda2005Description3 =	new Typewriter("#zelda-text-description-2005-3", typeWriterOptions);
	
	var typeWriterZelda2008 =				new Typewriter("#zelda-text-year-2008", typeWriterOptions);
	var typeWriterZelda2008Description0 =	new Typewriter("#zelda-text-description-2008-0", typeWriterOptions);
	
	var typeWriterZelda2010 =				new Typewriter("#zelda-text-year-2010", typeWriterOptions);
	var typeWriterZelda2010Description0 =	new Typewriter("#zelda-text-description-2010-0", typeWriterOptions);
	var typeWriterZelda2010Description1 =	new Typewriter("#zelda-text-description-2010-1", typeWriterOptions);
	var typeWriterZelda2010Description2 =	new Typewriter("#zelda-text-description-2010-2", typeWriterOptions);
	
	var typeWriterZelda2011 =				new Typewriter("#zelda-text-year-2011", typeWriterOptions);
	var typeWriterZelda2011Description0 =	new Typewriter("#zelda-text-description-2011-0", typeWriterOptions);
	var typeWriterZelda2011Description1 =	new Typewriter("#zelda-text-description-2011-1", typeWriterOptions);
	
	var typeWriterZelda2017 =				new Typewriter("#zelda-text-year-2017", typeWriterOptions);
	var typeWriterZelda2017Description0 =	new Typewriter("#zelda-text-description-2017-0", typeWriterOptions);
	var typeWriterZelda2017Description1 =	new Typewriter("#zelda-text-description-2017-1", typeWriterOptions);

	var typeWriterZelda2018 =				new Typewriter("#zelda-text-year-2018", typeWriterOptions);
	var typeWriterZelda2018Description0 =	new Typewriter("#zelda-text-description-2018-0", typeWriterOptions);
	var typeWriterZelda2018Description1 =	new Typewriter("#zelda-text-description-2018-1", typeWriterOptions);
	
	var typeWriterZelda2019 =				new Typewriter("#zelda-text-year-2019", typeWriterOptions);
	var typeWriterZelda2019Description0 =	new Typewriter("#zelda-text-description-2019-0", typeWriterOptions);
	var typeWriterZelda2019Description1 =	new Typewriter("#zelda-text-description-2019-1", typeWriterOptions);

	// The typewriter objects can only be sequenced in callbacks after the typewriter finishes.  This creates an insane callback hell, but it is unavoidable.
	// The top part of the Zelda page is fading in the title, several of the image icons, and then fading in half and full hearts to fill the heart meters.
	typeWriterZeldaTimeline.typeString("Timeline")
	.start()
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-item-count-ladder").fadeTo(250, 1);
		$("#zelda-text-item-count-ladder").fadeTo(250, 1);
	})
	.pauseFor(500)
	.callFunction(function() {
		$("#zelda-item-count-book").fadeTo(250, 1);
		$("#zelda-text-item-count-book").fadeTo(250, 1);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-mouse").fadeTo(250, 1);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-solderingiron").fadeTo(250, 1);
	})
	.pauseFor(250)									// Half and full red hearts are faded over empty white hearts (3.5 fills total).
	.callFunction(function() {
		$("#zelda-redhearthalf-0").fadeTo(250, 1);
		$("#zelda-whiteheart-0").fadeTo(250, 0);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-redheartfull-0").fadeTo(250, 1);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-redhearthalf-1").fadeTo(250, 1);
		$("#zelda-whiteheart-1").fadeTo(250, 0);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-redheartfull-1").fadeTo(250, 1);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-redhearthalf-2").fadeTo(250, 1);
		$("#zelda-whiteheart-2").fadeTo(250, 0);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-redheartfull-2").fadeTo(250, 1);
	})
	.pauseFor(250)
	.callFunction(function() {
		$("#zelda-redhearthalf-3").fadeTo(250, 1);
		$("#zelda-whiteheart-3").fadeTo(250, 0);
	})
	.pauseFor(500)
	.callFunction(function() {

		// Begin the cave man's text, and then the timeline text elements and images one at a time after.
		typeWriterZeldaSpeech0.typeString("It is dangerous to hire someone without")
		.start()
		.callFunction(function() {

			typeWriterZeldaSpeech1.typeString("knowing their journey! Read this!")
			.start()
			.callFunction(function() {

				typeWriterZelda1996.typeString("1996")
				.start()
				.callFunction(function() {
					$("#zelda-heart").fadeTo(250, 1);
				})
				.pauseFor(250)
				.callFunction(function() {

					typeWriterZelda1996Description0.typeString("QBASIC: first")
					.start()
					.callFunction(function() {

						typeWriterZelda1996Description1.typeString("programming class")
						.start()
						.pauseFor(250)
						.callFunction(function() {

							typeWriterZelda2005.typeString("2005")
							.start()
							.callFunction(function() {
								$("#zelda-book-0").fadeTo(250, 1);
							})
							.pauseFor(250)
							.callFunction(function() {

								typeWriterZelda2005Description0.typeString("UCF: BS in Computer Science")
								.start()
								.callFunction(function() {

									typeWriterZelda2005Description1.typeString("Minor in Digital Media")
									.start()
									.pauseFor(250)
									.callFunction(function() {
										$("#zelda-ladder-0").fadeTo(250, 1);
									})
									.pauseFor(250)
									.callFunction(function() {

										typeWriterZelda2005Description2.typeString("United Space Alliance")
										.start()
										.callFunction(function() {

											typeWriterZelda2005Description3.typeString("Computer Science Staff I")
											.start()
											.pauseFor(250)
											.callFunction(function() {

												typeWriterZelda2008.typeString("2008")
												.start()
												.callFunction(function() {
													$("#zelda-book-1").fadeTo(250, 1);
												})
												.pauseFor(250)
												.callFunction(function() {

													typeWriterZelda2008Description0.typeString("FIT: MS in Software Engr.")
													.start()
													.callFunction(function() {

														typeWriterZelda2010.typeString("2010")
														.start()
														.callFunction(function() {
															$("#zelda-ladder-1").fadeTo(250, 1);
														})
														.pauseFor(250)
														.callFunction(function() {

															typeWriterZelda2010Description0.typeString("United Space Alliance")
															.start()
															.callFunction(function() {

																typeWriterZelda2010Description1.typeString("Computer Science Staff II")
																.start()
																.pauseFor(250)
																.callFunction(function() {
																	$("#zelda-book-2").fadeTo(250, 1);
																})
																.pauseFor(250)
																.callFunction(function() {

																	typeWriterZelda2010Description2.typeString("PMP Certification (2010-2014)")
																	.start()
																	.callFunction(function() {

																		typeWriterZelda2011.typeString("2011")
																		.start()
																		.callFunction(function() {
																			$("#zelda-ladder-2").fadeTo(250, 1);
																		})
																		.pauseFor(250)
																		.callFunction(function() {

																			typeWriterZelda2011Description0.typeString("ERAU: Application Developer")
																			.start()
																			.callFunction(function() {

																				typeWriterZelda2011Description1.typeString("& Integration Specialist")
																				.start()
																				.pauseFor(250)
																				.callFunction(function() {

																					typeWriterZelda2017.typeString("2017")
																					.start()
																					.callFunction(function() {
																						$("#zelda-book-3").fadeTo(250, 1);
																					})
																					.pauseFor(250)
																					.callFunction(function() {

																						typeWriterZelda2017Description0.typeString("ERAU: BS in Computer ENGR.")
																						.start()
																						.callFunction(function() {

																							typeWriterZelda2017Description1.typeString("Minor in Entrepreneurship")
																							.start()
																							.pauseFor(250)
																							.callFunction(function() {

																								typeWriterZelda2018.typeString("2018")
																								.start()
																								.callFunction(function() {
																									$("#zelda-ladder-3").fadeTo(250, 1);
																								})
																								.pauseFor(250)
																								.callFunction(function() {

																									typeWriterZelda2018Description0.typeString("Forgotten Dimensions Escape")
																									.start()
																									.callFunction(function() {

																										typeWriterZelda2018Description1.typeString("Adventures: Owner & CTO")
																										.start()
																										.pauseFor(250)
																										.callFunction(function() {
																								
																											typeWriterZelda2019.typeString("2019")
																											.start()
																											.callFunction(function() {
																												$("#zelda-ladder-4").fadeTo(250, 1);
																											})
																											.pauseFor(250)
																											.callFunction(function() {

																												typeWriterZelda2019Description0.typeString("Evo Payments, Inc.")
																												.start()
																												.callFunction(function() {

																													typeWriterZelda2019Description1.typeString("Software engineer")
																													.start();
																												});
																											});
																										});
																									});
																								});
																							});
																						});
																					});
																				});
																			});
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});	
		});
	});
}


// Start the animations for the Megaman page, which are several sequenced images faded in with typewriter texts in a 3x4 grid.
function startMegamanAnimations() {

	// Create typewriter objects.  The typewriters can only work on a single div on creation, which makes unfortunately many typewriters needing to be created.
	var typeWriterOptions = {
		autoStart: false,
		cursor: "",
		delay: 50
	};

	var typeWriterMegamanInterests =	new Typewriter("#megaman-text-interests", typeWriterOptions);
	var typeWriterMegamanVideoGames0 =	new Typewriter("#megaman-text-videogames-0", typeWriterOptions);
	var typeWriterMegamanVideoGames1 =	new Typewriter("#megaman-text-videogames-1", typeWriterOptions);
	var typeWriterMegamanBoardGames0 =	new Typewriter("#megaman-text-boardgames-0", typeWriterOptions);
	var typeWriterMegamanBoardGames1 =	new Typewriter("#megaman-text-boardgames-1", typeWriterOptions);
	var typeWriterMegamanMtg0 =			new Typewriter("#megaman-text-mtg-0", typeWriterOptions);
	var typeWriterMegamanMtg1 =			new Typewriter("#megaman-text-mtg-1", typeWriterOptions);
	var typeWriterMegamanEscapeRooms0 =	new Typewriter("#megaman-text-escaperooms-0", typeWriterOptions);
	var typeWriterMegamanEscapeRooms1 =	new Typewriter("#megaman-text-escaperooms-1", typeWriterOptions);
	var typeWriterMegamanPhotography0 =	new Typewriter("#megaman-text-photography-0", typeWriterOptions);
	var typeWriterMegamanPhotography1 =	new Typewriter("#megaman-text-photography-1", typeWriterOptions);
	var typeWriterMegamanMovies =		new Typewriter("#megaman-text-movies", typeWriterOptions);
	var typeWriterMegamanCrafting0 =	new Typewriter("#megaman-text-crafting-0", typeWriterOptions);
	var typeWriterMegamanCrafting1 =	new Typewriter("#megaman-text-crafting-1", typeWriterOptions);
	var typeWriterMegaman3dPrinting0 =	new Typewriter("#megaman-text-3dprinting-0", typeWriterOptions);
	var typeWriterMegaman3dPrinting1 =	new Typewriter("#megaman-text-3dprinting-1", typeWriterOptions);
	var typeWriterMegamanCats0 =		new Typewriter("#megaman-text-cats-0", typeWriterOptions);
	var typeWriterMegamanCats1 =		new Typewriter("#megaman-text-cats-1", typeWriterOptions);
	var typeWriterMegamanThanks =		new Typewriter("#megaman-text-thanks", typeWriterOptions);

	// The typewriter objects can only be sequenced in callbacks after the typewriter finishes.  This creates an insane callback hell, but it is unavoidable.
	typeWriterMegamanInterests.typeString("Interests")
	.start()
	.pauseFor(250)
	.callFunction(function() {
		$("#megaman-videogames").fadeTo(250, 1);
	})
	.pauseFor(250)
	.callFunction(function() {

		// Begin row 1 of 4.
			
			typeWriterMegamanVideoGames0.typeString("Video")
			.start()
			.callFunction(function() {

				typeWriterMegamanVideoGames1.typeString("games")
				.start()
				.callFunction(function() {
					$("#megaman-boardgames").fadeTo(250, 1);
				})
				.pauseFor(250)
				.callFunction(function() {

					typeWriterMegamanBoardGames0.typeString("Board")
					.start()
					.callFunction(function() {
						
						typeWriterMegamanBoardGames1.typeString("games")
						.start()
						.callFunction(function() {
							$("#megaman-mtg").fadeTo(250, 1);
						})
						.pauseFor(250)
						.callFunction(function() {
								
							typeWriterMegamanMtg0.typeString("Magic:the")
							.start()
							.callFunction(function() {
									
								typeWriterMegamanMtg1.typeString("Gathering")
								.start()
								.callFunction(function() {
									$("#megaman-escaperooms").fadeTo(250, 1);
								})
								.pauseFor(250)
								.callFunction(function() {

									// Begin row 2 of 4.

										typeWriterMegamanEscapeRooms0.typeString("Escape")
										.start()
										.callFunction(function() {
															
											typeWriterMegamanEscapeRooms1.typeString("rooms")
											.start()
											.callFunction(function() {
												$("#megaman-photography").fadeTo(250, 1);
											})
											.pauseFor(250)
											.callFunction(function() {

												typeWriterMegamanPhotography0.typeString("Photo-")
												.start()
												.callFunction(function() {
														
													typeWriterMegamanPhotography1.typeString("graphy")
													.start()
													.callFunction(function() {
														$("#megaman-movies").fadeTo(250, 1);
													})
													.pauseFor(250)
													.callFunction(function() {
														
														typeWriterMegamanMovies.typeString("Movies")
														.start()
														.callFunction(function() {
															$("#megaman-crafting").fadeTo(250, 1);
														})
														.pauseFor(250)
														.callFunction(function() {
																
															// Begin row 3 of 4.
															
																typeWriterMegamanCrafting0.typeString("Make,hack")
																.start()
																.callFunction(function() {
																	
																	typeWriterMegamanCrafting1.typeString("& craft")
																	.start()
																	.callFunction(function() {
																		$("#megaman-3dprinting").fadeTo(250, 1);
																	})
																	.pauseFor(250)
																	.callFunction(function() {

																		typeWriterMegaman3dPrinting0.typeString("3D")
																		.start()
																		.callFunction(function() {
																				
																			typeWriterMegaman3dPrinting1.typeString("printing")
																			.start()
																			.callFunction(function() {
																				$("#megaman-cats").fadeTo(250, 1);
																			})
																			.pauseFor(250)
																			.callFunction(function() {
																					
																				typeWriterMegamanCats0.typeString("Cats &")
																				.start()
																				.callFunction(function() {

																					typeWriterMegamanCats1.typeString("kittens")
																					.start()
																					.pauseFor(250)
																					.callFunction(function() {

																						typeWriterMegamanThanks.typeString("Thanks for reading!")
																						.start()
																						.pauseFor(250)
																						.callFunction(function() {

																						// Begin row 4 of 4.

																							$("#megaman-linkedin").fadeTo(250, 1, function() {
																								$("#megaman-gmail").delay(750).fadeTo(250, 1, function() {
																									$("#megaman-phone").delay(500).fadeTo(250, 1);
																								});
																							});
																						})
																					});
																				});
																			});
																		});
																	});
															});
														});
													});
												});
											});
										});
								});
							});
						});
					});
				});
		});
	});
}