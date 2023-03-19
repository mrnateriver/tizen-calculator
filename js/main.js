/*
* Copyright (c) 2016 Evgenii Dobrovidov
* This file is part of "Just calculator".
*
* "Just calculator" is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* "Just calculator" is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with "Just calculator".  If not, see <http://www.gnu.org/licenses/>.
*/

function fitText(element) {
	element.style.fontSize = '';
	
    var e = element.parentNode,
    	maxWidth = e.offsetWidth - 40,
    	maxHeight = e.offsetHeight,
    	sizeX = element.offsetWidth,
    	sizeY = element.offsetHeight,
    	fontSize = parseInt(document.defaultView.getComputedStyle(element, null).fontSize, 10);
    
    //if (sizeY <= maxHeight && sizeX <= maxWidth) {
    	//return null;
    //}
    
    while ((sizeX > maxWidth || sizeY > maxHeight) && fontSize > 14) {
        fontSize -= 1;
        element.style.fontSize = fontSize + "px";
        sizeX = element.offsetWidth;
        sizeY = element.offsetHeight;
    }
    return element;
}

// Get all the keys from document
var cur_operator = document.querySelector("#current_operator");
var keys = document.querySelectorAll('#calculator .keys span, #calculator .top span.clear');
var operators = ['+', '-', 'x', '÷'];
var decimalAdded = false;

var first_operand = null;
var operator = null;
var second_operand = null;
var reset_input = false;

function calculate() {
	if (first_operand !== null && operator !== null && second_operand !== null) {
		var op = operator.replace(/x/g, '*').replace(/÷/g, '/');
		return eval('first_operand ' + op + ' second_operand');
	} else {
		return null;
	}
}

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
	keys[i].onclick = function(e) {
		// Get the input and button values
		var input = document.querySelector('.screen > #screen_text');
		var inputVal = input.innerHTML;
		var btnVal = this.innerHTML;
		
		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
		// If clear key is pressed, erase everything
		if (btnVal == 'C') {
			input.innerHTML = '';
			decimalAdded = false;
			
			first_operand = null;
			
			operator = null;
			cur_operator.innerHTML = operator;
			
			second_operand = null;
			
			reset_input = false;
		}
		
		// If eval key is pressed, calculate and display the result
		else if (btnVal == '=') {
			
			if (first_operand !== null && operator !== null) {
				if (second_operand === null) {
					second_operand = (+inputVal);
				}
				first_operand = calculate();
				cur_operator.innerHTML = null;
				//second_operand = null;
				
				input.innerHTML = first_operand;
				if (input.innerHTML.length > 11) {
					input.innerHTML = first_operand.toExponential(7);
				}
				reset_input = true;
			}
		}
		else if (operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			if (first_operand !== null) {
				if (!reset_input) {
					second_operand = (+inputVal);
					if (operator !== null) {
						//both arguments were entered, and user clicks operator again - first calculate result, assign it to first operand and then use standard procedure
						first_operand = calculate();
						
						operator = btnVal;
						cur_operator.innerHTML = operator;
						
						input.innerHTML = first_operand;
						if (input.innerHTML.length > 11) {
							input.innerHTML = first_operand.toExponential(7);
						}
					}	
				}
				//simply change operator if second argument was not entered or operator was not yet selected
				operator = btnVal;
				cur_operator.innerHTML = operator;
				
				reset_input = true;
				second_operand = null;
				
			} else if (btnVal == '-' && inputVal.trim() == '') {
				input.innerHTML = btnVal;
				
			} else if (inputVal.trim() != '' && inputVal.trim() != '-') {
				first_operand = (+input.innerHTML);
				
				operator = btnVal;
				cur_operator.innerHTML = operator;
				
				reset_input = true;
			}
		}
		// if any other key is pressed, just append it
		else {
			
			if (reset_input) {
				input.innerHTML = '';
				decimalAdded = false;
				reset_input = false;
			}
			if (second_operand !== null) {
				first_operand = null;
				
				operator = null;
				cur_operator.innerHTML = operator;
				
				second_operand = null;
			}
			if (input.innerHTML.length < 12) {
				if (btnVal == '.') {
					if (!decimalAdded) {
						if (input.innerHTML.trim() == '') {
							input.innerHTML = '0.'; 
						} else {
							input.innerHTML += btnVal;	
						}
						decimalAdded = true;
					}
					
				} else if (btnVal == '0') {
					if ((+inputVal) != 0 || decimalAdded || inputVal.trim() == '') {
						input.innerHTML += btnVal;
					}
					
				} else {
					if (inputVal.trim() == '0') {
						input.innerHTML = btnVal;
					} else {
						input.innerHTML += btnVal;	
					}
				}
			}
		}
		
		fitText(input);
		
		// prevent page jumps
		e.preventDefault();
	} 
}

window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName == "back") {
        	tizen.application.getCurrentApplication().exit();
        }
    });
    
    tizen.systeminfo.getPropertyValue("DISPLAY", function (screen) {
		var width = screen.resolutionWidth,
			height = screen.resolutionHeight;
		
		if (width < 360) {
			document.querySelector('#calculator').classList.add('small-screen');
		}
    });
};
