library(dplyr)
library(datasets)
library(tidyr)
library("WriteXLS")
library(reshape2)
library(readr)
library(lettercase)
library(here)

###########
######Make City Variables Human readable
##########

City.socrata.existing <- read_csv("https://open-data-demo.mtc.ca.gov/resource/pcwa-vbwz.csv")
City.update.august.2018 <- read_csv(here("projectionsdata_juris.csv"), col_types = cols(X1 = col_skip()))

City.socrata.existing <- City.socrata.existing %>% 
  arrange(category,county,juris,year,variable)
#the existing file has a bunch of vaues of 0 for Base Year B year 2040
#we'll need to check on whether this is something in the script 

# for comparison after all the changes below. 
City.backup <- City.update.august.2018

###########
######Rename City Variables
##########
City.update.august.2018$Variable <- City.update.august.2018$Variable %>%
  gsub("gqpop","Population in Group Quarters",.) %>%
  gsub("hhpop","Household Population",.) %>%
  gsub("\\<age0004","Population Age Under 4",.) %>%
  gsub("\\<age0519","Population Age 5 thru 19",.) %>%
  gsub("\\<age2044","Population Age 20 thru 44",.) %>%
  gsub("\\<age4564","Population Age 45 thru 64",.) %>%
  gsub("\\<age65p","Population Age 65 and Over",.) %>%
  #Female Age
  gsub("Female_age0004","Female Population Age Under 4",.) %>%
  gsub("Female_age0509","Female Population Age 5 thru 9",.) %>%
  gsub("Female_age1014","Female Population Age 10 thru 14",.) %>%
  gsub("Female_age1519","Female Population Age 15 thru 19",.) %>%
  gsub("Female_age2024","Female Population Age 20 thru 24",.) %>%
  gsub("Female_age2529","Female Population Age 25 thru 29",.) %>%
  gsub("Female_age3034","Female Population Age 30 thru 34",.) %>%
  gsub("Female_age3539","Female Population Age 35 thru 39",.) %>%
  gsub("Female_age4044","Female Population Age 40 thru 44",.) %>%
  gsub("Female_age4549","Female Population Age 45 thru 49",.) %>%
  gsub("Female_age5054","Female Population Age 50 thru 54",.) %>%
  gsub("Female_age5559","Female Population Age 55 thru 59",.) %>%
  gsub("Female_age6064","Female Population Age 60 thru 64",.) %>%
  gsub("Female_age6569","Female Population Age 65 thru 69",.) %>%
  gsub("Female_age7074","Female Population Age 70 thru 74",.) %>%
  gsub("Female_age7579","Female Population Age 75 thru 79",.) %>%
  gsub("Female_age8084","Female Population Age 80 thru 84",.) %>%
  gsub("Female_age85p","Female Population Age 85 and Over",.) %>%
  #Male Age 
  gsub("Male_age0004","Male Population Age Under 4",.) %>%
  gsub("Male_age0509","Male Population Age 5 thru 9",.) %>%
  gsub("Male_age1014","Male Population Age 10 thru 14",.) %>%
  gsub("Male_age1519","Male Population Age 15 thru 19",.) %>%
  gsub("Male_age2024","Male Population Age 20 thru 24",.) %>%
  gsub("Male_age2529","Male Population Age 25 thru 29",.) %>%
  gsub("Male_age3034","Male Population Age 30 thru 34",.) %>%
  gsub("Male_age3539","Male Population Age 35 thru 39",.) %>%
  gsub("Male_age4044","Male Population Age 40 thru 44",.) %>%
  gsub("Male_age4549","Male Population Age 45 thru 49",.) %>%
  gsub("Male_age5054","Male Population Age 50 thru 54",.) %>%
  gsub("Male_age5559","Male Population Age 55 thru 59",.) %>%
  gsub("Male_age6064","Male Population Age 60 thru 64",.) %>%
  gsub("Male_age6569","Male Population Age 65 thru 69",.) %>%
  gsub("Male_age7074","Male Population Age 70 thru 74",.) %>%
  gsub("Male_age7579","Male Population Age 75 thru 79",.) %>%
  gsub("Male_age8084","Male Population Age 80 thru 84",.) %>%
  gsub("Male_age85p","Male Population Age 85 and Over",.) %>%
  #Households
  gsub("tothh","Total Households",.) %>%
  gsub("mfdu","Multifamily Dwelling Units",.) %>%
  gsub("sfdu","Single Family Dwelling Units",.) %>%
  #Jobs 
  gsub("othempn","Other",.) %>%
  gsub("empres","Employed Residents",.) %>%
  gsub("fpsempn","Finance and Professional Services",.) %>%
  gsub("herempn","Health and Educational Services",.) %>%
  gsub("mwtempn","Manufacturing and Wholesale",.) %>%
  gsub("retempn","Retail",.) %>%
  gsub("agrempn","Agriculture and Natural Resources",.)

#rename concept to category
City.update.august.2018 <- rename(City.update.august.2018,
                                  Category=Concept)

#Demographics 
#See url:https://abag.ca.gov/planning/research/forecasts.html for example
City.update.august.2018$Category <- City.update.august.2018$Variable %>%
  gsub("Employed Residents","Demographics",.) %>%
  #Population by Age --> Age Demographics
  gsub("Population by Age","Population by Age",.) %>%
  #Population by Gender, Age --> Age Demographics
  gsub("Population by Gender, Age","Population by Gender and Age",.) %>%
  #Units --> Housing Units
  gsub("Units","Housing Units",.) %>%
  #Population --> Total Population
  gsub("Population","Total Population",.) %>%
  #Jobs --> Total Jobs
  gsub("Jobs","Total Jobs",.) %>%
  gsub("Households","Households",.)


#Fix source Values
#modeled --> Modeled
City.update.august.2018$source <- City.update.august.2018$source %>%
  gsub("modeled","Modeled",.) %>%
  #baseyear --> Base Year
  gsub("baseyear","Base Year",.) %>%
  #estimate --> Estimate
  gsub("estimate","Estimate",.)

#Check Values
#unique(Category)

#Round Values
City.update.august.2018$value <- round(City.update.august.2018$value, digits = 2)

#per @akselx's commits at https://github.com/BayAreaMetro/projections2040/commit/4f73a78fa13ca2d1995b6116e4b648c199098ad8,
#we remove household income quartiles from the outputs. 
City.update.august.2018 <- filter(City.update.august.2018,!Variable %in% 
                 c("hhincq1","hhincq2","hhincq3","hhincq4"))

##Order by City and County, then add a unique id for this ordering
##Also, add a count of the number of variables per city. 
SortOrderCity <- City.update.august.2018 %>%
  group_by(county, juris) %>%
  mutate(RecID = 1:n())

#Now, join the count and the unique 
#city/county id back to the variables 
City.update.august.2018 <- merge(City.update.august.2018, SortOrderCity)

City.update.august.2018 <- rename(City.update.august.2018, 
                                  Sort_Order=RecID)

#Compare with existing data, and input data

existing.names <- str_lower_case(names(City.socrata.existing))
new.names <- str_lower_case(names(City.update.august.2018))

setdiff(existing.names,new.names)
setdiff(new.names,existing.names)

#title case all the headers to match existing table
names(City.update.august.2018) <- str_title_case(names(City.update.august.2018))

City.update.august.2018 <- rename(City.update.august.2018, 
                                  Sort_Order='Sort Order')

#Export Tables for Socrata Upload
WriteXLS(City.update.august.2018,here("City Forecast.xls"))
