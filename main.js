const topDisplay = document.getElementById("topBar");
const matchesTable = document.getElementById("matches");
const currentTable = document.getElementById("season");
const scoreDisplay = document.getElementById("scoreDisplay");
const allGameData = []
var currentSeasonData = []
var allTeams = [];
var allTeamData = [];
var totalScore = 0;
var scoresByWeek = [];
var totalGameWeeks = 3;


function setup() {
    showLeagueButtons();
    //getAllData();
    console.log(allGameData);
    
    //updateNavBtns(1, false);
}

function showLeagueButtons() {
    const e0Btn = document.createElement("button");
        e0Btn.onclick = function() { selectLeague("e0") };
        e0Btn.classList.add("btn", "sportBtn");
            const e0BtnText = document.createElement("span");
            e0BtnText.innerText = "English Premier League";
            e0Btn.appendChild(e0BtnText);
        
    topDisplay.appendChild(e0Btn);

    const e1Btn = document.createElement("button");
    e1Btn.onclick = function() { selectLeague("e1") };
    e1Btn.classList.add("btn", "sportBtn");
        const e1BtnText = document.createElement("span");
        e1BtnText.innerText = "English Championship";
        e1Btn.appendChild(e1BtnText);
    
    topDisplay.appendChild(e1Btn);
}

function selectLeague(league){
    removeButtons();
    showSeasons(league);
}

function showSeasons(league) {
    const s2223Btn = document.createElement("button");
    s2223Btn.onclick = function() { selectSeason("2223", league) };
    s2223Btn.classList.add("btn", "leagueBtn");
            const s2223BtnText = document.createElement("span");
            s2223BtnText.innerText = "Season 2022/2023";
            s2223Btn.appendChild(s2223BtnText);
        
    topDisplay.appendChild(s2223Btn);

    const s2122Btn = document.createElement("button");
    s2122Btn.onclick = function() { selectSeason("2122", league) };
    s2122Btn.classList.add("btn", "leagueBtn");
            const s2122BtnText = document.createElement("span");
            s2122BtnText.innerText = "Season 2021/2022";
            s2122Btn.appendChild(s2122BtnText);
        
    topDisplay.appendChild(s2122Btn);
}

function selectSeason(season, league){
    removeButtons();
    console.log("League: " + league)
    console.log("Season: " + season)
    
    leagueSeason = league + "_" + season
    
    getAllData(leagueSeason);
    updateNavBtns(1, false);
}

function showResults(weekNum){
    showResultsTable(weekNum);
    if(weekNum <= totalGameWeeks) {
        updateNavBtns(weekNum+1, false);
    } else {
        showFinalScore();
        console.log("FINISHED!")
    }
    
}

function nextWeek(weekNum) {

    if(weekNum <= totalGameWeeks) {
        updateNavBtns(weekNum, true);
        console.log("Score: " + totalScore);
        console.log("Week Number: " + weekNum);
        createWeekTable(weekNum);
    } else {
        showFinalScore();
        console.log("FINISHED!")
    }
}

function showFinalScore() {
    scoreDisplay.innerHTML = "Game Over! Your Final Score is: " + totalScore;
}

async function getAllData(season){
    console.log(season)
    //Retrieve data from json file
    let url = `./archives/${season}.json`;
    console.log(url)

    try{
        let result = await fetch(url);

        let data = await result.json();

        await data.forEach(game => {

            const homeTeam = game.HomeTeam;
            const awayTeam = game.AwayTeam;
            const gameDate = game.Date;
            const gameWeek = game.WeekNum;
            const referee = game.Referee;
            const awayGoals = game.FTAG;
            const homeGoals = game.FTHG;
            const homeOdds = game.AvgH;
            const drawOdds = game.AvgD;
            const awayOdds = game.AvgA;
            const outcome = getOutcome(homeTeam, awayTeam, homeGoals, awayGoals);
            const selectedOutcome = "";
            const correct = false;

            const gameData = {gameWeek, gameDate, referee, homeTeam, awayTeam, outcome, homeGoals, awayGoals, homeOdds, drawOdds, awayOdds, selectedOutcome};
            allGameData.push(gameData);


            //Create array of all teams
            let index = allTeams.findIndex(team => team === homeTeam);
            if (index === -1) allTeams.push(homeTeam);
            allTeams.sort();

        })

        totalGameWeeks = allGameData[allGameData.length-1].gameWeek;
        console.log("Total Game Weeks: " + totalGameWeeks)

    }catch(error){
        console.log(error);
      }
}

function removeButtons(){
    let existingButtons = document.getElementsByClassName('btn');
    for (let button of existingButtons) {
        existingButtons[0].parentNode.removeChild(button);
    }
}

function updateNavBtns(weekNum, showRes){
    removeButtons();

    if(showRes){
        const continueBtn = document.createElement("button");
        continueBtn.onclick = function() { showResults(weekNum) };
        continueBtn.classList.add("btn", "continueBtn");
            const contBtnText = document.createElement("span");
            contBtnText.innerText = weekNum > 1 ? "Check Results of Week " + weekNum : "Check Results of Week 1";
            continueBtn.appendChild(contBtnText);
        
        topDisplay.appendChild(continueBtn);
    } else if(weekNum <= totalGameWeeks){
        const nextWeekBtn = document.createElement("button");
        nextWeekBtn.onclick = function() { nextWeek(weekNum) };
        nextWeekBtn.classList.add("btn", "nextWeekBtn");
            const nextBtnText = document.createElement("span");
            nextBtnText.innerText = weekNum == 1 ? "Start" : "Continue to Week " + weekNum;
            nextWeekBtn.appendChild(nextBtnText);

        topDisplay.appendChild(nextWeekBtn);
    }

}

function getOutcome(homeTeam, awayTeam, homeGoals, awayGoals) {
    if (homeGoals > awayGoals){
        return homeTeam;
    } else if(awayGoals > homeGoals){
        return awayTeam;
    } else {
        return "Draw";
    }
}

function removeTables() {
    let existingWeekTable = document.getElementsByClassName('weekTable')
    let existingSeasonTable = document.getElementsByClassName('seasonTable')
    if(typeof existingWeekTable[0] != 'undefined'){
        existingWeekTable[0].parentNode.removeChild(existingWeekTable[0]);
    }
    if(typeof existingSeasonTable[0] != 'undefined'){
        existingSeasonTable[0].parentNode.removeChild(existingSeasonTable[0]);
    }
}

function showResultsTable(weekNum) {
    removeTables();
    
    const newTable = document.createElement('table');
    newTable.setAttribute('border', '1');
    newTable.setAttribute('id', 'tableWeek' + (weekNum));
    newTable.setAttribute('class', 'weekTable');

    const tabCaption = document.createElement('caption');
    tabCaption.innerHTML = "Results for week " + weekNum;
    newTable.appendChild(tabCaption);

    var tbdy = document.createElement('tbody');
        var tr1 = document.createElement('tr');
            var th1 = document.createElement('th');
            th1.innerHTML = "Game";
            var th2 = document.createElement('th');
            th2.innerHTML = "Date";
            var th3 = document.createElement('th');
            th3.innerHTML = "Home Team";
            var th4 = document.createElement('th');
            th4.innerHTML = "";
            var th5 = document.createElement('th');
            th5.innerHTML = "Away Team";
            var th6 = document.createElement('th');
            th6.innerHTML = "Selected Outcome";
            var th7 = document.createElement('th');
            th7.innerHTML = "Outcome";

            tr1.appendChild(th1);
            tr1.appendChild(th2);
            tr1.appendChild(th3);
            tr1.appendChild(th4);
            tr1.appendChild(th5);
            //tr1.appendChild(th6);
            //tr1.appendChild(th7);

        tbdy.appendChild(tr1);

        weekData = allGameData.filter(game => game.gameWeek == weekNum);
        weekData.forEach((game, index) => {
            
            game.correct = game.selectedOutcome == game.outcome ? true : false;

            function updateCell(cell){
                if (cell.innerHTML == game.outcome){
                    if(game.correct) {
                        cell.classList.add("correct");
                    } else {
                        cell.classList.add("incorrect");
                    }
                } else if(cell.innerHTML == game.selectedOutcome){
                    cell.classList.add("correct");
                }
            }

            var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                td1.classList.add("head1");
                td1.innerHTML = index + 1;
                if(game.correct) {
                    td1.classList.add("correct");
                } else {
                    td1.classList.add("incorrect");
                }

                var td2 = document.createElement('td');
                td2.classList.add("head1");
                td2.innerHTML = game.gameDate;

                var td3 = document.createElement('td');
                td3.classList.add("head1");
                td3.innerHTML = game.homeTeam;
                updateCell(td3);
                
                var td4 = document.createElement('td');
                td4.classList.add("head1");
                td4.innerHTML = "Draw";
                updateCell(td4);

                var td5 = document.createElement('td');
                td5.classList.add("head1");
                td5.innerHTML = game.awayTeam;
                updateCell(td5);
                
                var td6 = document.createElement('td');
                td6.classList.add("head1");
                    td6.innerHTML = game.selectedOutcome;
                    if (td6.innerHTML != "" && game.correct) {
                        td6.classList.add("correct");
                        td6.classList.remove("incorrect");
                    } else {
                        td6.classList.add("incorrect");
                        td6.classList.remove("correct");
                    }

                var td7 = document.createElement('td');
                td7.classList.add("head1");
                    td7.innerHTML = game.outcome;

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                //tr.appendChild(td6);
                //tr.appendChild(td7);

            tbdy.appendChild(tr);

            var tr2 = document.createElement('tr');  
                var td_1 = document.createElement('td');
                td_1.innerHTML = "";
                var td_2 = document.createElement('td');
                td_2.innerHTML = "";
                var td_3 = document.createElement('td');
                td_3.innerHTML = game.homeOdds;
                var td_4 = document.createElement('td');
                td_4.innerHTML = game.drawOdds;
                var td_5 = document.createElement('td');
                td_5.innerHTML = game.awayOdds;
                
                tr2.appendChild(td_1);
                tr2.appendChild(td_2);
                tr2.appendChild(td_3);
                tr2.appendChild(td_4);
                tr2.appendChild(td_5);

            tbdy.appendChild(tr2);
                
        })

    newTable.appendChild(tbdy);
    matchesTable.appendChild(newTable);
    
    
    updateScore(weekNum);
}

function createWeekTable(weekNum) {

    removeTables()
    createSeasonTable(weekNum)

    const newTable = document.createElement('table');
    newTable.setAttribute('border', '1');
    newTable.setAttribute('id', 'tableWeek' + (weekNum));
    newTable.setAttribute('class', 'weekTable');

    const tabCaption = document.createElement('caption');
    tabCaption.innerHTML = "Upcoming games for week " + weekNum;
    newTable.appendChild(tabCaption);

    var tbdy = document.createElement('tbody');
        var tr1 = document.createElement('tr');
            var th1 = document.createElement('th');
            th1.innerHTML = "Game";
            var th2 = document.createElement('th');
            th2.innerHTML = "Date";
            var th3 = document.createElement('th');
            th3.innerHTML = "Home Team";
            var th4 = document.createElement('th');
            th4.innerHTML = "";
            var th5 = document.createElement('th');
            th5.innerHTML = "Away Team";

            tr1.appendChild(th1);
            tr1.appendChild(th2);
            tr1.appendChild(th3);
            tr1.appendChild(th4);
            tr1.appendChild(th5);

        tbdy.appendChild(tr1);

        weekData = allGameData.filter(game => game.gameWeek == weekNum);
        weekData.forEach((game, index) => {
            
            var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                td1.classList.add("head1");
                td1.innerHTML = index + 1;

                var td2 = document.createElement('td');
                td2.classList.add("head1");
                td2.innerHTML = game.gameDate;

                var td3 = document.createElement('td');
                td3.classList.add("head1");
                    const newHomeBtn = document.createElement("button");
                    newHomeBtn.onclick = function() { btnClick(this, game) };
                    newHomeBtn.classList.add("betOption");
                        const homeText = document.createElement("span");
                        
                        homeText.innerText = game.homeTeam;
                        newHomeBtn.appendChild(homeText);
                        game.selectedOutcome == homeText.innerText ? newHomeBtn.classList.add("selectedBtn") : newHomeBtn.classList.remove("selectedBtn");

                    td3.appendChild(newHomeBtn);
                
                var td4 = document.createElement('td');
                td4.classList.add("head1");
                    const newDrawBtn = document.createElement("button");
                    newDrawBtn.onclick = function() { btnClick(this, game) };
                    newDrawBtn.classList.add("betOption");
                        const drawText = document.createElement("span");
                        drawText.innerText = "Draw";
                        newDrawBtn.appendChild(drawText);
                        game.selectedOutcome == drawText.innerText ? newDrawBtn.classList.add("selectedBtn") : newDrawBtn.classList.remove("selectedBtn");

                    td4.appendChild(newDrawBtn);

                var td5 = document.createElement('td');
                td5.classList.add("head1");
                    const newAwayBtn = document.createElement("button");
                    newAwayBtn.onclick = function() { btnClick(this, game) };
                    newAwayBtn.classList.add("betOption");
                        const awayText = document.createElement("span");
                        awayText.innerText = game.awayTeam;
                        newAwayBtn.appendChild(awayText);
                        game.selectedOutcome == awayText.innerText ? newAwayBtn.classList.add("selectedBtn") : newAwayBtn.classList.remove("selectedBtn");

                    td5.appendChild(newAwayBtn);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);

            tbdy.appendChild(tr);

            var tr2 = document.createElement('tr');  
                var td_1 = document.createElement('td');
                td_1.innerHTML = "";
                var td_2 = document.createElement('td');
                td_2.innerHTML = "";
                var td_3 = document.createElement('td');
                td_3.innerHTML = game.homeOdds;
                var td_4 = document.createElement('td');
                td_4.innerHTML = game.drawOdds;
                var td_5 = document.createElement('td');
                td_5.innerHTML = game.awayOdds;
                
                tr2.appendChild(td_1);
                tr2.appendChild(td_2);
                tr2.appendChild(td_3);
                tr2.appendChild(td_4);
                tr2.appendChild(td_5);

            tbdy.appendChild(tr2);
                
        })

    newTable.appendChild(tbdy);
    matchesTable.appendChild(newTable);
}

function createSeasonTable(weekNum) {
    
    let currentTeamSeasonData = getCurrentData(weekNum);
    //console.log(currentTeamSeasonData)

    const newTable = document.createElement('table');
    newTable.setAttribute('border', '1');
    newTable.setAttribute('id', 'seasonTable' + (weekNum));
    newTable.setAttribute('class', 'seasonTable');

        const tabCaption = document.createElement('caption');
        tabCaption.innerHTML = "Current Table - Week " + weekNum;
        newTable.appendChild(tabCaption);

        var tbdy = document.createElement('tbody');
            var tr1 = document.createElement('tr');
                var th1 = document.createElement('th');
                th1.innerHTML = "Position";
                var th2 = document.createElement('th');
                th2.innerHTML = "Team";
                var th3 = document.createElement('th');
                th3.innerHTML = "Played";
                var th4 = document.createElement('th');
                th4.innerHTML = "Won";
                var th5 = document.createElement('th');
                th5.innerHTML = "Drawn";
                var th6 = document.createElement('th');
                th6.innerHTML = "Lost";
                var th7 = document.createElement('th');
                th7.innerHTML = "For";
                var th8 = document.createElement('th');
                th8.innerHTML = "Against";
                var th9 = document.createElement('th');
                th9.innerHTML = "GD";
                var th10 = document.createElement('th');
                th10.innerHTML = "Points";

                tr1.appendChild(th1);
                tr1.appendChild(th2);
                tr1.appendChild(th3);
                tr1.appendChild(th4);
                tr1.appendChild(th5);
                tr1.appendChild(th6);
                tr1.appendChild(th7);
                tr1.appendChild(th8);
                tr1.appendChild(th9);
                tr1.appendChild(th10);
            tbdy.appendChild(tr1);

            allTeamData.forEach((team, index) => {
                var tr = document.createElement('tr');
                    th1 = document.createElement('th');
                    th1.innerHTML = index + 1;
                    th2 = document.createElement('th');
                    th2.innerHTML = team.name;
                    th3 = document.createElement('th');
                    th3.innerHTML = team.played;
                    th4 = document.createElement('th');
                    th4.innerHTML = team.wins;
                    th5 = document.createElement('th');
                    th5.innerHTML = team.draws;
                    th6 = document.createElement('th');
                    th6.innerHTML = team.losses;
                    th7 = document.createElement('th');
                    th7.innerHTML = team.gf;
                    th8 = document.createElement('th');
                    th8.innerHTML = team.ga;
                    th9 = document.createElement('th');
                    th9.innerHTML = team.gd;
                    th10 = document.createElement('th');
                    th10.innerHTML = team.pts;

                    tr.appendChild(th1);
                    tr.appendChild(th2);
                    tr.appendChild(th3);
                    tr.appendChild(th4);
                    tr.appendChild(th5);
                    tr.appendChild(th6);
                    tr.appendChild(th7);
                    tr.appendChild(th8);
                    tr.appendChild(th9);
                    tr.appendChild(th10);
                tbdy.appendChild(tr);
            })

        newTable.appendChild(tbdy);
    currentTable.appendChild(newTable);

}

function getCurrentData(weekNum) {
    let currentData = [];
    for (let i=1; i<weekNum; i++){
        currentData.push(allGameData.filter(game => game.gameWeek == i))
    }

    return calcResults(currentData)
}

function calcResults(currentData) {
    allTeamData = []
    allTeams.forEach(team=> {
        let name = team;
        let played = 0;
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let gf = 0;
        let ga = 0;

        currentData.forEach(week => {
            week.forEach(game => {
                if(team === game.homeTeam) {
                    gf += game.homeGoals;
                    ga += game.awayGoals;
                    played++;
                    if(game.homeGoals > game.awayGoals) wins++;
                    if(game.homeGoals == game.awayGoals) draws++;
                    if(game.awayGoals > game.homeGoals) losses++;
                } else if(team === game.awayTeam) {
                    gf += game.awayGoals;
                    ga += game.homeGoals;
                    played++;
                    if(game.awayGoals > game.homeGoals) wins++;
                    if(game.homeGoals == game.awayGoals) draws++;
                    if(game.homeGoals > game.awayGoals) losses++;
                }
            })
            
        })
        const pts = 3*wins + draws;
        const gd = gf - ga;
        const teamData = {name, pts, played, wins, draws, losses, gf, ga, gd}
        allTeamData.push(teamData);
    })
    //console.log(allTeamData);

    //Sort teams by points, then gd
    allTeamData.sort((a,b) => {
        var n = b.pts - a.pts;
        if(n !== 0) {
            return n;
        }
        return b.gd - a.gd;
    });
    return allTeamData;
}

function btnClick(clickedBtn, game) {
    const td = clickedBtn.parentElement;
    const availOptions = td.parentElement.getElementsByClassName("betOption");

    for (let option of availOptions) {

        if(option == clickedBtn){
            game.selectedOutcome = option.textContent;
        }
    }

    createWeekTable(game.gameWeek);

}

function updateScore(weekNum) {

    const weekScore = weekData.filter(game => game.correct).length;

    let newScore = {
        "Week" : weekNum,
        "Score" : weekScore
    }

    scoresByWeek.push(newScore);

    totalScore += weekScore;

    scoreDisplay.innerHTML = "Total Score: " + totalScore;
}