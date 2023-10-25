'use strict'
$(document).ready(function () {

    function hexToRGBA(hex, alpha) {
        let r = "", g = "", b = ""
        if (hex.length >= 6) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        } else {
            r = parseInt(hex.slice(1, 2), 16);
            g = parseInt(hex.slice(2, 3), 16);
            b = parseInt(hex.slice(3, 4), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }



    function ViewModel() {
        var scaleType = "fill"

        self.imgBackground = ko.observable("");
        self.imgForeground = ko.observable("");
        self.gradientColor = ko.observable("#40A017");
        self.maskColor = ko.observable("#40A017");
        self.backgroundColor = ko.observable("#40A017");
        self.maskAlpha = ko.observable(0);
        self.message = ko.observable("");

        self.gradientBackground = ko.computed({
            read: function () {
                let color = self.gradientColor()
                let colorAlpha1 = hexToRGBA(color, 1)
                let colorAlpha2 = hexToRGBA(color, 0.8)
                let colorAlpha3 = hexToRGBA(color, 0.6)
                let colorAlpha4 = hexToRGBA(color, 0.4)
                let colorAlpha5 = hexToRGBA(color, 0.2)
                let colorAlpha6 = hexToRGBA(color, 0)
                return "linear-gradient(to top"
                    + ", " + colorAlpha1
                    + ", " + colorAlpha2
                    + ", " + colorAlpha3
                    + ", " + colorAlpha4
                    + ", " + colorAlpha5
                    + ", " + colorAlpha6
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ", #FFF0"
                    + ")";
            },
            write: self.gradientColor
        });

        $("#file-background").change(function () {
            let file = $("#file-background").prop('files')[0]
            $("#labelSelectBackground").text(file.name)

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener("load", function () {
                self.imgBackground(this.result)
            });
        });

        $("#file-foreground").change(function () {
            let file = $("#file-foreground").prop('files')[0]
            $("#labelSelectForeground").text(file.name)

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener("load", function () {
                self.imgForeground(this.result)
            });
        });

        $('#img_background').on("load", function () { setTimeout(setupSizes(), 100); });
        $('#img_foreground').on("load", function () { setTimeout(setupSizes(), 100); });

        $('#radio_fill').change(function () { scaleType = "fill"; setupSizes() });
        $('#radio_fit').change(function () { scaleType = "fit"; setupSizes() });

        function setupSizes() {
            let width = $('#div_background_composition').width()
            let height = $('#div_background_composition').height()

            function fillImage(imgElement) {
                let bgWidth = imgElement.width()
                let bgHeight = imgElement.height()

                var newBgWidth, newBgHeight, factorImage;
                if (width > height) {

                    factorImage = height / bgHeight
                    newBgWidth = bgWidth * factorImage
                    newBgHeight = bgHeight * factorImage

                    if (newBgWidth < width) {
                        factorImage = width / newBgWidth
                        newBgHeight = newBgHeight * factorImage
                        newBgWidth = newBgWidth * factorImage
                    }

                    imgElement.width(newBgWidth)
                    imgElement.height(newBgHeight)

                } else {

                    factorImage = width / bgWidth
                    newBgWidth = bgWidth * factorImage
                    newBgHeight = bgHeight * factorImage

                    if (newBgHeight < height) {
                        factorImage = height / newBgHeight
                        newBgHeight = newBgHeight * factorImage
                        newBgWidth = newBgWidth * factorImage
                    }

                    imgElement.width(newBgWidth)
                    imgElement.height(newBgHeight)
                }

                var marginTop, marginLeft;
                if (newBgWidth > width) {
                    marginTop = 0
                    marginLeft = (width - newBgWidth) / 2
                } else {
                    marginTop = (height - newBgHeight) / 2
                    marginLeft = 0
                }
                imgElement.css("top", marginTop + "px")
                imgElement.css("left", marginLeft + "px")
            }

            function fitImage(imgElement) {
                let bgWidth = imgElement.width()
                let bgHeight = imgElement.height()

                var newBgWidth, newBgHeight, factorImage;
                if (width > height) {

                    factorImage = height / bgHeight
                    newBgWidth = bgWidth * factorImage
                    newBgHeight = bgHeight * factorImage

                    if (newBgWidth > width) {
                        factorImage = width / newBgWidth
                        newBgHeight = newBgHeight * factorImage
                        newBgWidth = newBgWidth * factorImage
                    }

                    imgElement.width(newBgWidth)
                    imgElement.height(newBgHeight)

                } else {

                    factorImage = width / bgWidth
                    newBgWidth = bgWidth * factorImage
                    newBgHeight = bgHeight * factorImage

                    if (newBgHeight > height) {
                        factorImage = height / newBgHeight
                        newBgHeight = newBgHeight * factorImage
                        newBgWidth = newBgWidth * factorImage
                    }

                    imgElement.width(newBgWidth)
                    imgElement.height(newBgHeight)
                }

                if (newBgWidth <= width) {
                    let marginLeft = (width - newBgWidth) / 2
                    imgElement.css("left", marginLeft)
                }

                if (newBgHeight <= height) {
                    let marginTop = (height - newBgHeight) / 2
                    imgElement.css("top", marginTop)
                }
            }

            fillImage($('#img_background'))

            let imgForegroundElement = $('#img_foreground')
            if (scaleType == "fill") { // center_crop with no margin
                $('#div_foreground').width("100%")
                $('#div_foreground').height("100%")
                $('#div_foreground').css("left", "0px")
                $('#div_foreground').css("top", "0px")
                fillImage(imgForegroundElement)

            } else { // fit_center wit  h margins
                $('#div_foreground').width(width - 20)
                $('#div_foreground').height(height - 20)
                $('#div_foreground').css("left", "10px")
                $('#div_foreground').css("top", "10px")
                fitImage(imgForegroundElement)
            }
        }

        $('#div_frame').resize(function () { setupSizes() });

    }

    var vm = new ViewModel();
    ko.applyBindings(vm);
});
