document.addEventListener("DOMContentLoaded", checkIfLogged);

function checkIfLogged() {
    fetch(`${userApi}/token`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
       if (!data.loggedin) {
        window.location.href = "index.html";
       } else {
        drawCharts();
       }
     })
    .catch(error => console.log(error));
}

function drawCharts() {
    fetch(`${moodApi}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json())
    .then(data => {
        result = data.data;
        if (result) {
            drawScoreChart(result);
            drawCountChart(result);
            drawLineChart(result);
            document.body.style.display = 'block';
        } else {
            alert("No mood logs detected. You will be redirected to the home page.")
            window.location.href = "index.html";
        }
    })
    .catch(error => error.message)
};

function getMostLoggedMood(result) {
        const moodLogged = document.getElementById("moodLogged"); 
        let message = "The moods which you have logged the most: ";
        moodLogged.append(message);
        const header = document.createElement("ol");
        header.classList.add("d-sm-flex");
        header.id = "topMoods";
        moodLogged.after(header);
    
        let mood = result.mood;
        let map = {};
  
        for (let i in result) {
            const current = result[i].mood;
  
            if (map[current]) {
                map[current]++;
            } else {
                map[current] = 1;
            }

            if (map[mood] < map[current]) {
                mood = current;
            }
        }

        let sorted = Object.keys(map).sort((a, b) => map[b] - map[a]);
        let count = Object.values(map).sort().reverse(); 
        let top5 = sorted.slice(0, 5);

        for (let i = 0; i < top5.length; i++) {
            let li = document.createElement("li");
            li.classList.add("mx-3");
            let message = `${top5[i]} (${count[i]}) `
            li.innerText = message;
            header.appendChild(li);
        }
};

function getOverallPercent(result) {
        var moodScore = 0;
        var moodTotal = (5 * result.length);
    
        for (var i = 0; i < result.length; i++) {
            moodScore += result[i].rating;
        }
    
        const percentRound = Math.round(moodScore / moodTotal * 100)
        return percentRound;
};

function getMoodCount(result) {

        var moodCount = [0,0,0,0,0];

        for (var i = 0; i < result.length; i++) {
            if (result[i].rating == 1) {
                moodCount[0]++; 
            } else if (result[i].rating == 2) {
                moodCount[1]++;
            } else if (result[i].rating == 3) {
                moodCount[2]++;
            } else if (result[i].rating == 4) {
                moodCount[3]++;
            } else if (result[i].rating == 5) {
                moodCount[4]++;
            } else {
              return;
            }
        };

        return moodCount;
};

const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
    const {ctx, chartArea: {left, top, width, height}} = chart;
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.setLineDash(options.borderDash || []);
    ctx.lineDashOffset = options.borderDashOffset;
    ctx.strokeRect(left, top, width, height);
    ctx.restore();
    }
};
    
function drawScoreChart(result) {
        const moodScore = getOverallPercent(result);
        const bgCol = moodScoreResult(moodScore);

        const gaugeChartText = {
            id: 'gaugeChartText',
            afterDatasetsDraw(chart, args, pluginOptions) {
            const {ctx, data, chartArea: {top, bottom, left, right, width, height
            }, scales: {r} } = chart;
            
            ctx.save();
            const xCoord = chart.getDatasetMeta(0).data[0].x;
            const yCoord = chart.getDatasetMeta(0).data[0].y;
            const score = data.datasets[0].data[0];
    
            ctx.font = '55px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'bottom';
            ctx.fillText(score, xCoord, yCoord - 20);

            }
        }   
    
        const ctx = document.getElementById("moodScoreChart").getContext('2d');

        var scoreChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [moodScore, (100 - moodScore)],
                    backgroundColor: [
                        bgCol,
                        'rgba(255,255,255, 0.9)'
                    ],
                    borderColor: [
                        'rgba(0, 0, 0, 0.9)',
                        'rgba(0, 0, 0, 0.9)'
                    ],
                    borderWidth: 1,
                    cutout: '85%',
                    circumference: 180,
                    rotation: 270
                }]
                },
            options: {
                plugins: {
                    tooltip: {
                        enabled: false
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
            },
            plugins: [gaugeChartText],
        }); 
};

function drawLineChart(result) {
        const latestResults = result.splice(-25);
        let dates = [];
        let ratings = [];

        for (let i = 0; i < latestResults.length; i++) {
            dates.push(latestResults[i].datetime);
            ratings.push(latestResults[i].rating);
        }

        const plugin = {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart, args, options) => {
              const {ctx} = chart;
              ctx.save();
              ctx.globalCompositeOperation = 'destination-over';
              ctx.fillStyle = options.color || '#99ffff';
              ctx.fillRect(0, 0, chart.width, chart.height);
              ctx.restore();
            }
          };

        var yLabels = {
            1 : displayText[0], 2 : displayText[1], 3 : displayText[2], 4 : displayText[3], 5 : displayText[4]
        }

        var ctxL = document.getElementById("lineChart").getContext('2d');
        ctxL.canvas.width = 1200;
        ctxL.canvas.height = 600;
        var lineChart = new Chart(ctxL, {
            type: 'line',
            data: {
            labels: dates,
            datasets: [
            {
            pointRadius: 5,
            pointBackgroundColor: function (context) {
                let value = context.dataset.data[context.dataIndex];

                if (value == 1) {
                    return 'rgba(219, 34, 55, 1)';
                } else if (value == 2) {
                    return 'rgba(249, 114, 25, 1)';
                } else if (value == 3) {
                    return 'rgba(255, 200, 11, 1)';                      
                } else if (value == 4) {
                    return 'rgba(179, 213, 0, 1)'                      
                } else if (value == 5) {
                    return 'rgba(104, 199, 57, 1)';                       
                }
            },
            backgroundColor: [
                'rgba(0, 0, 0, 0.5)',
            ],
            borderColor: [
                'rgba(0, 0, 0, 0.5)',
            ],
            data: ratings,
            tension: 0.3,
            fill: {
                target: {value: 3.0},
                below: '#DB2237',
                above: '#68C739',
            },
        },
        ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                      color: "black"
                    }
                  },
            y: {
                min: 0,
                max: 6,
                ticks: {
                    color: "black",
                    callback: function(value, index, values) {
                        return yLabels[value];
                    }
                },
            },
            },    
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                customCanvasBackgroundColor: {
                    color: 'white',
                  },
                tooltip: {
                    callbacks: {
                        label: function(toolTipItem, data) {
                            return 'Mood Rating: ' + yLabels[toolTipItem.formattedValue];
                        },
                        labelColor: function(toolTipItem, chart) {
                            if (toolTipItem.formattedValue == 1) {
                                return {
                                    backgroundColor: 'rgba(219, 34, 55, 1)'
                                }
                            } else if (toolTipItem.formattedValue == 2) {
                                return {
                                    backgroundColor: 'rgba(249, 114, 25, 1)'
                                }
                            } else if (toolTipItem.formattedValue == 3) {
                                return {
                                    backgroundColor: 'rgba(255, 200, 11, 1)'
                                }                            
                            } else if (toolTipItem.formattedValue == 4) {
                                return {
                                    backgroundColor: 'rgba(179, 213, 0, 1)'
                                }                           
                            } else if (toolTipItem.formattedValue == 5) {
                                return {
                                    backgroundColor: 'rgba(104, 199, 57, 1)'
                                }                           
                            }
                        },
                    },
                },           
                chartAreaBorder,   
            },
        },
        plugins: [chartAreaBorder, plugin],
        });
};

function drawCountChart(result) {
        const moodCount = getMoodCount(result);
        getMostLoggedMood(result);

        const countChartText = {
            id: 'countChartText',
            afterDatasetsDraw(chart, args, pluginOptions) {
                const {ctx, data, chartArea: {top, bottom, left, right, width, height
                }, scales: {r} } = chart;
                
                ctx.save();
                const xCoord = chart.getDatasetMeta(0).data[0].x;
                const yCoord = chart.getDatasetMeta(0).data[0].y;
                const score = sumValues(data.datasets[0].data);
    
                ctx.font = '50px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseLine = 'bottom';
                ctx.fillText(score, xCoord, yCoord);
                }
            }

        const ctxC = document.getElementById("moodCountChart").getContext('2d');
        var countChart = new Chart(ctxC, {
        type: 'doughnut',
        data: {
            labels: displayText,
            datasets: [{
                data: moodCount,
                backgroundColor: [
                  'rgba(219, 34, 55, 1)',
                  'rgba(249, 114, 25, 1)',
                  'rgba(255, 200, 11, 1)',
                  'rgba(179, 213, 0, 1)',
                  'rgba(104, 199, 57, 1)'
                ],
                hoverOffset: 4
              }]
            },
        options: {
            plugins: { 
                legend: {
                  labels: {
                    color: "black", 
                  }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
        },
        plugins: [countChartText],
        }); 
};

function moodScoreResult(result) {
    const moodScoreMsg = document.getElementById("moodScoreResponse");
    const additionalInfo = document.getElementById("additionalInfo");
    const source = document.getElementById("source");
    const tipList = document.getElementById("tipList");

    tips.forEach((tip) => {
        let li = document.createElement("li");
        li.style.fontSize = "medium";
        li.classList.add("mx-3");
        li.innerText = tip;
        tipList.appendChild(li);
    })

    const link = document.createTextNode("Source - " + sourceLink);
    source.style.fontSize = "small";
    source.appendChild(link);
    source.href = sourceLink;

    let message = `Your mood score rating is ${result} which means on average you have felt: `;
    
    if (result >= 0 && result <= 20) {
        moodScoreMsg.textContent = message + displayText[0];
        additionalInfo.textContent = lowScoreMsg;
        return 'rgba(219, 34, 55, 1)';
    } else if (result > 20 && result <= 40) {
        moodScoreMsg.textContent = message + displayText[1];
        additionalInfo.textContent = lowScoreMsg;
        return 'rgba(249, 114, 25, 1)';
    } else if (result > 40 && result <= 60) {
        moodScoreMsg.textContent = message + displayText[2];
        additionalInfo.textContent = lowScoreMsg;
        return 'rgba(255, 200, 11, 1)';
    } else if (result > 60 && result <= 80) {
        moodScoreMsg.textContent = message + displayText[3];
        additionalInfo.textContent = highScoreMsg;
        return 'rgba(179, 213, 0, 1)';
    } else if (result > 80 && result <= 100) {
        moodScoreMsg.textContent = message + displayText[4];
        additionalInfo.textContent = highScoreMsg;
        return 'rgba(104, 199, 57, 1)'; 
    } else {
        moodScoreMsg.textContent = "";
    }
};

function sumValues(data) {
    let sum = 0;

    data.forEach(value => {
      sum += value;
    });
  
    return sum;
};