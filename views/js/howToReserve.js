
       var image1= document.getElementById("1");
       image1.addEventListener('mouseover', setImage1On);
       image1.addEventListener('mouseout', setImage1Out);
       function setImage1On(){var i="1";image1.style.backgroundImage= "url('/views/assets/How_To_Reserve/Step1B.png')"; hoverFunOn(i);}
       function setImage1Out(){var i="1";image1.style.backgroundImage= "url('/views/assets/How_To_Reserve/Step1.png')" ;hoverFunOut(i);}


       var image2= document.getElementById("2");
       image2.addEventListener('mouseover', setImage2On);
       image2.addEventListener('mouseout', setImage2Out);
       function setImage2On(){var i="2"; hoverFunOn(i);}
       function setImage2Out(){var i="2"; hoverFunOut(i);}

       var image3= document.getElementById("3");
       image3.addEventListener('mouseover', setImage3On);
       image3.addEventListener('mouseout', setImage3Out);
       function setImage3On(){var i="3"; image3.style.backgroundImage= "url('/views/assets/How_To_Reserve/Step3B.png')"; hoverFunOn(i);}
       function setImage3Out(){var i="3"; image3.style.backgroundImage= "url('/views/assets/How_To_Reserve/Step3.png')"; hoverFunOut(i);}

       var image4= document.getElementById("4");
       image4.addEventListener('mouseover', setImage4On);
       image4.addEventListener('mouseout', setImage4Out);
       function setImage4On(){var i="4"; hoverFunOn(i);}
       function setImage4Out(){var i="4"; hoverFunOut(i);}

       var image5= document.getElementById("5");
       image5.addEventListener('mouseover', setImage5On);
       image5.addEventListener('mouseout', setImage5Out);
       function setImage5On(){var i="5"; image5.style.backgroundImage= "url('/views/assets/How_To_Reserve/Step5B.png')"; hoverFunOn(i);}
       function setImage5Out(){var i="5"; image5.style.backgroundImage= "url('/views/assets/How_To_Reserve/Step5.png')"; hoverFunOut(i);}

       function hoverFunOn(e){
           var image = document.getElementById(e)
           image.style.height="19vw"
           image.style.width="32vw"
           image.style.marginTop="1vw"
           image.style.marginBottom="1vw"
           image.style.marginRight="0vw"
           image.style.marginLeft="0vw"
       }
       function hoverFunOut(e){
           var image = document.getElementById(e)
           image.style.height="17vw"
           image.style.width="30vw"
           image.style.marginTop="2vw"
           image.style.marginBottom="2vw"
           image.style.marginRight="1vw"
           image.style.marginLeft="1vw"
       }

       var btn= document.getElementById("btn");
       btn.addEventListener('mouseover', setBtnOn);
       btn.addEventListener('mouseout', setBtnOut);
       function setBtnOn(){
        btn.style.backgroundColor="#B79257"
       }
       function setBtnOut(){
        btn.style.backgroundColor="#8A1538"
       }