setwd("~/Sites/bbc/news/special/2015/newsspec_9602/source/data")
library(XLConnect)
library(rjson)

list.files()
workbook <- loadWorkbook('EXAMPLE_CALCULATIONS.xlsm')

testData <- readWorksheet(workbook, sheet='testing')

colnames(testData) <- testData[1,]

# remove row 1
testData <- testData[-1,]
testData
colnames(testData)[1] <- 'question'
testData <- testData[!is.na(testData$question),]
head(testData)
rownames(testData) <- gsub(' ', '_', testData[,1])
testData <- testData[,-1]
testData <- as.data.frame(t(testData))
testData

sapply(testData, class)

dir.create('../js/spec/features', showWarnings=F, recursive=T)

write(paste('define(', toJSON(as.data.frame(t(testData))), ');', sep=''), '../js/spec/features/fixtureData.js')

