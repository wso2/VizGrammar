function checkConfig(config, metadata){

	if (config.xTitle == null) {
		config.xTitle = config.x;
	}

	if (config.yTitle == null) {
		config.yTitle = config.y;
	}

	if (config.colorScale == null) {
		config.colorScale = "category10";
	}

	if (config.grid == null) {
		config.grid  = true; 
	}

	if (config.zero == null) {
		config.zero = false;
	}

	if (config.color == null) {
		config.color = -1;
	} else {
		config.color = metadata.names.indexOf(config.color);
	}

	if (config.maxLength == null) {
		config.maxLength = -1;
	}

	config.x = metadata.names.indexOf(config.x);
    config.y = metadata.names.indexOf(config.y);

    return config;
}