import {EventEmitter} from 'events';
let emitter = new EventEmitter();
emitter.setMaxListeners(100);
let emitterOn = emitter.on;
emitter.on = function(type, listner){
 	emitter.removeAllListeners(type);
 	let args = [type, listner];
 	emitterOn.apply(emitter, args);
};
emitter.ons = function(type, listner){
	let args = [type, listner];
	emitterOn.apply(emitter, args);
}

function form2js(nameValues, skipEmpty)
{
	var result = {},
		arrays = {},
		delimiter = '.',
		j, k, l,
		value,
		nameParts,
		currResult,
		arrNameFull,
		arrName,
		arrIdx,
		namePart,
		_nameParts;

	for (let name in nameValues)
	{
		value = nameValues[name];

		if (skipEmpty && (value === '' || value === null)) continue;
		_nameParts = name.split(delimiter);
		nameParts = [];
		currResult = result;
		arrNameFull = '';

		for(j = 0; j < _nameParts.length; j++)
		{
			namePart = _nameParts[j].split('][');
			if (namePart.length > 1)
			{
				for(k = 0; k < namePart.length; k++)
				{
					if (k === 0)
					{
						namePart[k] = namePart[k] + ']';
					}
					else if (k === namePart.length - 1)
					{
						namePart[k] = '[' + namePart[k];
					}
					else
					{
						namePart[k] = '[' + namePart[k] + ']';
					}

					arrIdx = namePart[k].match(/([a-z_]+)?\[([a-z_][a-z0-9_]+?)\]/i);
					if (arrIdx)
					{
						for(l = 1; l < arrIdx.length; l++)
						{
							if (arrIdx[l]) nameParts.push(arrIdx[l]);
						}
					}
					else{
						nameParts.push(namePart[k]);
					}
				}
			}
			else
				nameParts = nameParts.concat(namePart);
		}

		for (j = 0; j < nameParts.length; j++)
		{
			namePart = nameParts[j];

			if (namePart.indexOf('[]') > -1 && j === nameParts.length - 1)
			{
				arrName = namePart.substr(0, namePart.indexOf('['));
				arrNameFull += arrName;

				if (!currResult[arrName]) currResult[arrName] = [];
				currResult[arrName].push(value);
			}
			else if (namePart.indexOf('[') > -1)
			{
				arrName = namePart.substr(0, namePart.indexOf('['));
				arrIdx = namePart.replace(/(^([a-z_]+)?\[)|(\]$)/gi, '');

				/* Unique array name */
				arrNameFull += '_' + arrName + '_' + arrIdx;

				/*
				 * Because arrIdx in field name can be not zero-based and step can be
				 * other than 1, we can't use them in target array directly.
				 * Instead we're making a hash where key is arrIdx and value is a reference to
				 * added array element
				 */

				if (!arrays[arrNameFull]) arrays[arrNameFull] = {};
				if (arrName !== '' && !currResult[arrName]) currResult[arrName] = [];

				if (j === nameParts.length - 1)
				{
					if (arrName === '')
					{
						currResult.push(value);
						arrays[arrNameFull][arrIdx] = currResult[currResult.length - 1];
					}
					else
					{
						currResult[arrName].push(value);
						arrays[arrNameFull][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
					}
				}
				else
				{
					if (!arrays[arrNameFull][arrIdx])
					{
						if ((/^[0-9a-z_]+\[?/i).test(nameParts[j+1])) currResult[arrName].push({});
						else currResult[arrName].push([]);

						arrays[arrNameFull][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
					}
				}

				currResult = arrays[arrNameFull][arrIdx];
			}
			else
			{
				arrNameFull += namePart;

				if (j < nameParts.length - 1) /* Not the last part of name - means object */
				{
					if (!currResult[namePart]) currResult[namePart] = {};
					currResult = currResult[namePart];
				}
				else
				{
					currResult[namePart] = value;
				}
			}
		}
	}

	return result;
}

function js2form(obj, lvl) {
	var result = [], i, name;
	if (arguments.length === 1) lvl = 0;

    if (obj == null)
    {
        result = [{ name: "", value: null }];
    }
    else if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || obj instanceof Date)
    {
        result = [
            { name: "", value : obj }
        ];
    }
    else if (obj instanceof Array)
    {
        for (i = 0; i < obj.length; i++)
        {
            name = "[" + i + "]";
            result = result.concat(getSubValues(obj[i], name, lvl + 1));
        }
    }
    else
    {
        for (i in obj)
        {
            name = i;
            result = result.concat(getSubValues(obj[i], name, lvl + 1));
        }
    }

	return result;
}

function getSubValues(subObj, name, lvl)
{
	var itemName;
	var result = [], tempResult = js2form(subObj, lvl + 1), i, tempItem;

	for (i = 0; i < tempResult.length; i++)
	{
		itemName = name;
		if (/^\[\d+?\]/.test(tempResult[i].name))
		{
			itemName += tempResult[i].name;
		}
		else if (/^[a-zA-Z_][a-zA-Z_0-9]*/.test(tempResult[i].name))
		{
			itemName += '.' + tempResult[i].name;
		}

		tempItem = { name: itemName, value: tempResult[i].value };
		result.push(tempItem);
	}

	return result;
}

export {emitter,form2js,js2form}