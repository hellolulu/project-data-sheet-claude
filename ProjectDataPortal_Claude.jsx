
// ProjectDataPortal — Screen 1 (Project List) + Screen 2 (Section A)
// Single-file React prototype

import { useState, useEffect, useRef } from "react";

const USERS = [
  { uuid: "user-001", name: "Mary Yip",      role: "mo_secretary",   initials: "MY" },
  { uuid: "user-002", name: "Henry Lam",      role: "gm",             initials: "HL" },
  { uuid: "user-003", name: "Wong Siu Fung",  role: "pic",            initials: "WF" },
  { uuid: "user-004", name: "Ho Yuk Ling",    role: "qs_manager",     initials: "HY" },
  { uuid: "user-005", name: "Raymond Lam",    role: "sic",            initials: "RL" },
  { uuid: "user-006", name: "Chan Ho Ming",   role: "engineer",       initials: "CM" },
  { uuid: "user-007", name: "Alice Leung",    role: "qs_team_leader", initials: "AL" },
  { uuid: "user-008", name: "Kevin Tsang",    role: "cost_account",   initials: "KT" },
  { uuid: "user-009", name: "David Chan",     role: "it",             initials: "DC" },
];

const ROLE_LABELS = {
  mo_secretary: "MO Secretary", engineer: "Engineer",
  qs_team_leader: "QS Team Leader", qs_manager: "QS Manager",
  sic: "SIC", pic: "PIC", gm: "GM",
  cost_account: "Cost Account", it: "IT", system_admin: "System Admin",
};

const STAGE_ORDER = [
  "mo_secretary","delegation","engineer","qs_team_leader",
  "qs_manager","sic","pic","gm","cost_account","it","complete",
];

const STAGE_LABEL = {
  mo_secretary:"MO Secretary", delegation:"Delegation", engineer:"Engineer",
  qs_team_leader:"QS Team Leader", qs_manager:"QS Manager", sic:"SIC",
  pic:"PIC", gm:"GM", cost_account:"Cost Account", it:"IT", complete:"Setup Complete",
};

// Maps a stage to the user UUID currently holding that stage across all projects
const STAGE_HOLDER_UUID = {
  mo_secretary:"user-001", delegation:"user-003", engineer:"user-006",
  qs_team_leader:"user-007", qs_manager:"user-004", sic:"user-005",
  pic:"user-003", gm:"user-002", cost_account:"user-008", it:"user-009",
};

const INITIAL_PROJECTS = [
  // ── uuid-001: delegation stage — fresh project, MO Sec submitted, awaiting PIC + QSM delegation
  {
    uuid:"uuid-001", siteCode:"2026-RES-WWT", fullName:"Wan Wan Terrace",
    shortName:"WWT", estateName:"Wan Wan Estate", estateNameTBC:false,
    locationUUID:"loc-uuid-001", leasePlanURL:null,
    stage:"delegation", status:"in_progress",
    nature:["residential"], revisions:[],
    assignedRoles:{ pic:"user-003", sic:"", engineer:"", qsManager:"user-004", qsTeamLeader:"", costAccount:"user-008" },
    approvalHistory:[],
    updatedAt:"2026-06-10T09:00:00", createdAt:"2026-06-10T09:00:00",
  },
  // ── uuid-002: qs_team_leader stage — engineer submitted, QS TL reviewing
  {
    uuid:"uuid-002", siteCode:"2026-COM-KTD", fullName:"Kai Tak Development Phase 2",
    shortName:"KTD2", estateName:"", estateNameTBC:true,
    locationUUID:"loc-uuid-002", leasePlanURL:null,
    stage:"qs_team_leader", status:"in_progress",
    nature:["office"], revisions:[],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      siteAreaSM:"8500", siteAreaSF:"91493",
      gfaSM:"68000", gfaSF:"732000",
      domesticGfaSM:"0", domesticGfaSF:"0",
      nonDomesticGfaSM:"68000", nonDomesticGfaSF:"732000",
      constructionFloorAreaSM:"72000", constructionFloorAreaSF:"775000",
      natureOfProject:["office"],
      noOfBlocksStorey:"1 Tower x 55 Storeys",
      residentialUnits:{ tower:"0", villa:"", house:"" },
      carpark:{ residential:"0", commercial:"350", visitor:"50", motorcycle:"40", bicycle:"100", loadingUnloading:"8", publicVehicle:"0", lgvHgvCoach:"6" },
      beamPlus:{ target:"Platinum", actual:"" },
      dates:{
        commencement:              { target:"2026-09-01", actual:"" },
        siteFormationCommencement: { target:"2026-06-01", actual:"" },
        capCommencement:           { target:"2027-01-01", actual:"" },
        occupationPermit:          { target:"2030-06-30", actual:"" },
        phasedOccupationPermit:    { target:"", actual:"" },
        practicalCompletion:       { target:"2030-09-30", actual:"" },
        sectionalCompletion:       { target:"", actual:"" },
        consentToAssign:           { target:"", actual:"" },
        certificateOfCompliance:   { target:"2031-03-31", actual:"" },
        buildingCovenant:          { target:"2031-03-31", actual:"" },
      },
      defectLiabilityPeriod:"12_months",
      projectPhasing:"Single phase",
      developer:"Kai Tak Commercial Properties Ltd",
      cpm:{ title:"Project Manager", name:"Jimmy Ho Wai Kit", email:"jimmyho@ktcp.com.hk" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"Ronald Lu & Partners",
      architectureAP:{ name:"Ronald Lu", bdCode:"BDAP" },
      rse:{ name:"Arup (HK) Ltd", bdCode:"BDRSE" },
      meConsultant:"WSP Group",
      rge:{ name:"Meinhardt (HK) Ltd", bdCode:"BDRGE" },
      landscapeConsultant:"Earthasia Ltd",
      interiorDesigner:"LWK & Partners",
      sustainabilityConsultant:"Environ Hong Kong Ltd",
      qsConsultant:"Rider Levett Bucknall",
      otherConsultants:[],
      estateManagement:"",
      mainContractor:"Gammon Construction Ltd",
      contractorLicences:["HKBR-2025-08831"],
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"" },
    },
    sectionC:{ typeOfContract:["inhouse"], paymentTerm:["monthly_progress"], remarks:"", qsTLSignedOff:false },
    approvalHistory:[{ stage:"engineer", action:"submitted", userUUID:"user-006", timestamp:"2026-06-01T09:00:00", returnedToStage:null, note:"" }],
    updatedAt:"2026-06-01T09:00:00", createdAt:"2026-05-01T09:00:00",
  },
  // ── uuid-003: sic stage — mid approval chain, engineer + QS TL + QS Mgr already approved
  {
    uuid:"uuid-003", siteCode:"2025-RES-TMW", fullName:"Tuen Mun West Residences",
    shortName:"TMW", estateName:"Tuen Mun West Estate", estateNameTBC:false,
    locationUUID:"loc-uuid-003", leasePlanURL:null,
    stage:"sic", status:"in_progress",
    nature:["residential"], revisions:[],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      siteAreaSM:"9200", siteAreaSF:"99028",
      gfaSM:"36800", gfaSF:"396115",
      domesticGfaSM:"33100", domesticGfaSF:"356354",
      nonDomesticGfaSM:"3700", nonDomesticGfaSF:"39826",
      constructionFloorAreaSM:"39500", constructionFloorAreaSF:"425174",
      natureOfProject:["residential"],
      noOfBlocksStorey:"4 Towers x 36 Storeys",
      residentialUnits:{ tower:"580", villa:"", house:"" },
      carpark:{ residential:"260", commercial:"30", visitor:"35", motorcycle:"40", bicycle:"100", loadingUnloading:"4", publicVehicle:"0", lgvHgvCoach:"2" },
      beamPlus:{ target:"Gold", actual:"" },
      dates:{
        commencement:              { target:"2024-08-01", actual:"2024-08-12" },
        siteFormationCommencement: { target:"2024-05-01", actual:"2024-05-18" },
        capCommencement:           { target:"2024-11-01", actual:"" },
        occupationPermit:          { target:"2028-06-30", actual:"" },
        phasedOccupationPermit:    { target:"", actual:"" },
        practicalCompletion:       { target:"2028-09-30", actual:"" },
        sectionalCompletion:       { target:"", actual:"" },
        consentToAssign:           { target:"2028-12-31", actual:"" },
        certificateOfCompliance:   { target:"2029-03-31", actual:"" },
        buildingCovenant:          { target:"2029-03-31", actual:"" },
      },
      defectLiabilityPeriod:"3_years",
      projectPhasing:"Single phase",
      developer:"Tuen Mun Residential Holdings Ltd",
      cpm:{ title:"Client Project Manager", name:"Patrick Chan Wai Kit", email:"patrickchan@tmrh.com.hk" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"P&T Architects and Engineers Ltd",
      architectureAP:{ name:"Thomas Ng", bdCode:"BDAP" },
      rse:{ name:"Mott MacDonald Hong Kong Ltd", bdCode:"BDRSE" },
      meConsultant:"Parsons Brinckerhoff (HK) Ltd",
      rge:{ name:"Ove Arup & Partners HK Ltd", bdCode:"BDRGE" },
      landscapeConsultant:"ADI Ltd",
      interiorDesigner:"",
      sustainabilityConsultant:"Environ Hong Kong Ltd",
      qsConsultant:"Rider Levett Bucknall",
      otherConsultants:[{ title:"Traffic Consultant", name:"Arup Transport Consultants" }],
      estateManagement:"Tuen Mun Property Management Ltd",
      mainContractor:"Paul Y. Construction Group",
      contractorLicence:"HKBR-2024-04412",
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"Alice Leung" },
    },
    sectionC:{
      typeOfContract:["inhouse"],
      paymentTerm:["monthly_progress"],
      remarks:"Standard in-house contract. 3-year defect liability applies to structural works.",
      qsTLSignedOff:true,
    },
    approvalHistory:[
      { stage:"engineer",       action:"submitted", userUUID:"user-006", timestamp:"2025-11-10T10:00:00", returnedToStage:null, note:"" },
      { stage:"qs_team_leader", action:"approved",  userUUID:"user-007", timestamp:"2025-11-18T09:30:00", returnedToStage:null, note:"" },
      { stage:"qs_manager",     action:"approved",  userUUID:"user-004", timestamp:"2025-11-25T11:00:00", returnedToStage:null, note:"" },
    ],
    updatedAt:"2025-11-25T11:00:00", createdAt:"2025-09-01T09:00:00",
  },
  // ── uuid-004: gm stage — almost complete, PIC approved, awaiting GM sign-off
  {
    uuid:"uuid-004", siteCode:"2025-RES-SKW", fullName:"Sai Kung Waterfront",
    shortName:"SKW", estateName:"", estateNameTBC:false,
    locationUUID:"loc-uuid-001", leasePlanURL:null,
    stage:"gm", status:"in_progress",
    nature:["residential"], revisions:[],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      siteAreaSM:"8500", siteAreaSF:"91493",
      gfaSM:"25500", gfaSF:"274479",
      domesticGfaSM:"22950", domesticGfaSF:"247032",
      nonDomesticGfaSM:"2550", nonDomesticGfaSF:"27448",
      constructionFloorAreaSM:"27200", constructionFloorAreaSF:"292778",
      natureOfProject:["residential"],
      noOfBlocksStorey:"3 Towers x 38 Storeys",
      residentialUnits:{ tower:"320", villa:"", house:"" },
      carpark:{ residential:"350", commercial:"20", visitor:"30", motorcycle:"45", bicycle:"120", loadingUnloading:"4", publicVehicle:"0", lgvHgvCoach:"2" },
      beamPlus:{ target:"Gold", actual:"" },
      dates:{
        commencement:              { target:"2024-02-01", actual:"2024-02-12" },
        siteFormationCommencement: { target:"2023-12-01", actual:"2023-12-08" },
        capCommencement:           { target:"2024-05-15", actual:"2024-06-02" },
        occupationPermit:          { target:"2028-03-31", actual:"" },
        phasedOccupationPermit:    { target:"", actual:"" },
        practicalCompletion:       { target:"2028-06-30", actual:"" },
        sectionalCompletion:       { target:"", actual:"" },
        consentToAssign:           { target:"2028-09-30", actual:"" },
        certificateOfCompliance:   { target:"2028-12-31", actual:"" },
        buildingCovenant:          { target:"2028-12-31", actual:"" },
      },
      defectLiabilityPeriod:"3_years",
      projectPhasing:"Single phase",
      developer:"Sai Kung Waterfront Development Ltd",
      cpm:{ title:"Client Project Manager", name:"Clarence Ng Chak Kin", email:"clarenceng@shkp.com" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"Ronald Lu & Partners",
      architectureAP:{ name:"Ronald Lu", bdCode:"BDAP" },
      rse:{ name:"Arup (HK) Ltd", bdCode:"BDRSE" },
      meConsultant:"J. Roger Preston Ltd",
      rge:{ name:"Fugro Geotechnical Services", bdCode:"BDRGE" },
      landscapeConsultant:"EarthAsia Landscape Architects",
      interiorDesigner:"",
      sustainabilityConsultant:"Ramboll BeamPlus Consultancy",
      qsConsultant:"Rider Levett Bucknall",
      otherConsultants:[{ title:"Traffic Consultant", name:"MVA Hong Kong" }],
      estateManagement:"Sai Kung Property Management Ltd",
      mainContractor:"Gammon Construction Ltd",
      contractorLicence:"HKBR-2023-07821",
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"Alice Leung" },
    },
    sectionC:{
      typeOfContract:["inhouse"],
      paymentTerm:["monthly_progress"],
      remarks:"Standard in-house contract terms apply.",
      qsTLSignedOff:true,
    },
    approvalHistory:[
      { stage:"engineer",       action:"submitted", userUUID:"user-006", timestamp:"2025-06-10T10:00:00", returnedToStage:null, note:"" },
      { stage:"qs_team_leader", action:"approved",  userUUID:"user-007", timestamp:"2025-06-18T09:30:00", returnedToStage:null, note:"" },
      { stage:"qs_manager",     action:"approved",  userUUID:"user-004", timestamp:"2025-06-25T11:00:00", returnedToStage:null, note:"" },
      { stage:"sic",            action:"approved",  userUUID:"user-005", timestamp:"2025-07-02T14:20:00", returnedToStage:null, note:"" },
      { stage:"pic",            action:"approved",  userUUID:"user-003", timestamp:"2025-07-08T16:00:00", returnedToStage:null, note:"" },
    ],
    updatedAt:"2025-07-08T16:00:00", createdAt:"2025-03-01T09:00:00",
  },
  // ── uuid-005: complete — IT setup done, full history, for reference and revision demo trigger
  {
    uuid:"uuid-005", siteCode:"2024-MIX-TPK", fullName:"Tai Po Kau Mixed Development",
    shortName:"TPK", estateName:"Tai Po Kau Garden", estateNameTBC:false,
    locationUUID:"loc-uuid-002", leasePlanURL:"gbp-tpk-simulated.pdf",
    stage:"complete", status:"approved",
    nature:["residential"], revisions:[],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      gbpURL:"gbp-tpk-simulated.pdf",
      siteAreaSM:"12400", siteAreaSF:"133472",
      gfaSM:"49600", gfaSF:"533882",
      domesticGfaSM:"38200", domesticGfaSF:"411215",
      nonDomesticGfaSM:"11400", nonDomesticGfaSF:"122709",
      constructionFloorAreaSM:"52800", constructionFloorAreaSF:"568334",
      natureOfProject:["residential"],
      noOfBlocksStorey:"2 Towers x 42 Storeys + Podium Retail",
      residentialUnits:{ tower:"620", villa:"", house:"" },
      carpark:{ residential:"280", commercial:"60", visitor:"40", motorcycle:"30", bicycle:"80", loadingUnloading:"6", publicVehicle:"0", lgvHgvCoach:"4" },
      beamPlus:{ target:"Platinum", actual:"Gold Plus (Provisional)" },
      dates:{
        commencement:              { target:"2022-08-01", actual:"2022-08-15" },
        siteFormationCommencement: { target:"2022-05-01", actual:"2022-05-20" },
        capCommencement:           { target:"2022-11-01", actual:"2022-11-08" },
        occupationPermit:          { target:"2026-06-30", actual:"2026-07-15" },
        phasedOccupationPermit:    { target:"2026-04-30", actual:"2026-05-02" },
        practicalCompletion:       { target:"2026-08-31", actual:"2026-09-10" },
        sectionalCompletion:       { target:"2026-04-30", actual:"2026-05-02" },
        consentToAssign:           { target:"2026-10-31", actual:"2026-11-03" },
        certificateOfCompliance:   { target:"2027-01-31", actual:"" },
        buildingCovenant:          { target:"2027-01-31", actual:"" },
      },
      defectLiabilityPeriod:"3_years",
      projectPhasing:"Phase 1: Residential Towers (2022–2026) / Phase 2: Retail Podium (2023–2026)",
      developer:"Tai Po Kau Development Holdings Ltd",
      cpm:{ title:"Client Project Manager", name:"Raymond Ho Chun Wai", email:"raymond.ho@tpkdev.com.hk" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"Dennis Lau & Ng Chun Man Architects",
      architectureAP:{ name:"Dennis Lau", bdCode:"BDAP" },
      rse:{ name:"Meinhardt (Hong Kong) Ltd", bdCode:"BDRSE" },
      meConsultant:"Parsons Brinckerhoff (HK) Ltd",
      rge:{ name:"Ove Arup & Partners HK Ltd", bdCode:"BDRGE" },
      landscapeConsultant:"Belt Collins International Ltd",
      interiorDesigner:"AB Concept Ltd",
      sustainabilityConsultant:"Environ Hong Kong Ltd",
      qsConsultant:"Davis Langdon & Seah Hong Kong Ltd",
      otherConsultants:[
        { title:"Traffic Consultant", name:"Arup Transport Consultants" },
        { title:"Acoustic Consultant", name:"Shen Milsom & Wilke Ltd" },
      ],
      estateManagement:"Tai Po Property Management Services Ltd",
      mainContractor:"Hip Hing Construction Co. Ltd",
      contractorLicence:"HKBR-2021-03312",
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"Alice Leung" },
    },
    sectionC:{
      typeOfContract:["inhouse"],
      paymentTerm:["monthly_progress"],
      remarks:"In-house contract. Retail podium sublet to Hip Hing under nominated sub-contract for fit-out works.",
      qsTLSignedOff:true,
    },
    sectionD:{
      financeProjectCode:"2024-TPK-001",
      subCodes:[
        { id:1, subCode:"001-A", description:"Main Contract — Residential" },
        { id:2, subCode:"001-B", description:"Main Contract — Retail Podium" },
        { id:3, subCode:"002-A", description:"Nominated Sub-Contract — Lift Installation" },
        { id:4, subCode:"002-B", description:"Nominated Sub-Contract — Curtain Wall" },
        { id:5, subCode:"003-A", description:"Professional Fees — Architecture" },
        { id:6, subCode:"003-B", description:"Professional Fees — Structural & M&E" },
      ],
    },
    postApprovalTasks:{ financeCodesStatus:"assigned", itSetupStatus:"complete", itNotes:"Oracle project code 2024-TPK-001 activated. All sub-codes configured. Access granted to project team on 25 Aug 2024." },
    approvalHistory:[
      { stage:"engineer",       action:"submitted", userUUID:"user-006", timestamp:"2024-01-20T10:00:00", returnedToStage:null, note:"" },
      { stage:"qs_team_leader", action:"approved",  userUUID:"user-007", timestamp:"2024-01-28T09:30:00", returnedToStage:null, note:"" },
      { stage:"qs_manager",     action:"approved",  userUUID:"user-004", timestamp:"2024-02-02T11:00:00", returnedToStage:null, note:"" },
      { stage:"sic",            action:"approved",  userUUID:"user-005", timestamp:"2024-02-06T14:20:00", returnedToStage:null, note:"" },
      { stage:"pic",            action:"approved",  userUUID:"user-003", timestamp:"2024-02-10T16:00:00", returnedToStage:null, note:"" },
      { stage:"gm",             action:"approved",  userUUID:"user-002", timestamp:"2024-02-18T10:00:00", returnedToStage:null, note:"" },
      { stage:"cost_account",   action:"submitted", userUUID:"user-008", timestamp:"2024-03-05T09:00:00", returnedToStage:null, note:"" },
      { stage:"it",             action:"completed", userUUID:"user-009", timestamp:"2024-08-25T09:00:00", returnedToStage:null, note:"Oracle project code 2024-TPK-001 activated." },
    ],
    updatedAt:"2024-08-25T09:00:00", createdAt:"2023-01-15T09:00:00",
  },
  // ── uuid-006: cost_account stage — GM approved, awaiting finance codes
  {
    uuid:"uuid-006", siteCode:"2024-HOT-CWB", fullName:"Causeway Bay Boutique Hotel",
    shortName:"CWB", estateName:"", estateNameTBC:false,
    locationUUID:"loc-uuid-005", leasePlanURL:null,
    stage:"cost_account", status:"approved",
    nature:["hotel"], revisions:[],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      siteAreaSM:"3200", siteAreaSF:"34445",
      gfaSM:"19200", gfaSF:"206669",
      domesticGfaSM:"0", domesticGfaSF:"0",
      nonDomesticGfaSM:"19200", nonDomesticGfaSF:"206669",
      constructionFloorAreaSM:"20500", constructionFloorAreaSF:"220660",
      natureOfProject:["hotel"],
      noOfBlocksStorey:"1 Tower x 28 Storeys",
      residentialUnits:{ tower:"", villa:"", house:"" },
      carpark:{ residential:"0", commercial:"40", visitor:"10", motorcycle:"12", bicycle:"20", loadingUnloading:"3", publicVehicle:"0", lgvHgvCoach:"2" },
      beamPlus:{ target:"Gold Plus", actual:"" },
      dates:{
        commencement:              { target:"2023-03-01", actual:"2023-03-15" },
        siteFormationCommencement: { target:"2023-01-15", actual:"2023-01-20" },
        capCommencement:           { target:"2023-06-01", actual:"2023-06-10" },
        occupationPermit:          { target:"2026-09-30", actual:"" },
        phasedOccupationPermit:    { target:"", actual:"" },
        practicalCompletion:       { target:"2026-12-31", actual:"" },
        sectionalCompletion:       { target:"", actual:"" },
        consentToAssign:           { target:"", actual:"" },
        certificateOfCompliance:   { target:"2027-06-30", actual:"" },
        buildingCovenant:          { target:"2027-06-30", actual:"" },
      },
      defectLiabilityPeriod:"12_months",
      projectPhasing:"Single phase",
      developer:"CWB Hospitality Development Ltd",
      cpm:{ title:"Client Project Manager", name:"Linda Fok Mei Ling", email:"lindafok@cwbhotel.com" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"Wong & Ouyang (HK) Ltd",
      architectureAP:{ name:"Michael Wong", bdCode:"BDAP" },
      rse:{ name:"Ove Arup & Partners HK Ltd", bdCode:"BDRSE" },
      meConsultant:"Parsons Brinckerhoff (HK) Ltd",
      rge:{ name:"Fugro Geotechnical Services", bdCode:"BDRGE" },
      landscapeConsultant:"EDSA Asia",
      interiorDesigner:"LTW Designworks",
      sustainabilityConsultant:"Environ Hong Kong Ltd",
      qsConsultant:"Faithful+Gould",
      otherConsultants:[],
      estateManagement:"CWB Property Services Ltd",
      mainContractor:"Leighton Contractors (Asia) Ltd",
      contractorLicence:"HKBR-2022-08831",
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"Alice Leung" },
    },
    sectionC:{
      typeOfContract:["inhouse"],
      paymentTerm:["monthly_progress"],
      remarks:"Hotel fit-out works under separate contract.",
      qsTLSignedOff:true,
    },
    approvalHistory:[
      { stage:"engineer",       action:"submitted", userUUID:"user-006", timestamp:"2024-06-10T10:00:00", returnedToStage:null, note:"" },
      { stage:"qs_team_leader", action:"approved",  userUUID:"user-007", timestamp:"2024-06-18T09:30:00", returnedToStage:null, note:"" },
      { stage:"qs_manager",     action:"approved",  userUUID:"user-004", timestamp:"2024-06-25T11:00:00", returnedToStage:null, note:"" },
      { stage:"sic",            action:"approved",  userUUID:"user-005", timestamp:"2024-07-02T14:20:00", returnedToStage:null, note:"" },
      { stage:"pic",            action:"approved",  userUUID:"user-003", timestamp:"2024-07-08T16:00:00", returnedToStage:null, note:"" },
      { stage:"gm",             action:"approved",  userUUID:"user-002", timestamp:"2024-07-15T10:00:00", returnedToStage:null, note:"" },
    ],
    updatedAt:"2024-07-15T10:00:00", createdAt:"2023-11-01T09:00:00",
  },
  // ── uuid-007: revision in progress — QS TL reviewing GFA + OP date changes
  {
    uuid:"uuid-007", siteCode:"2023-RES-TKO", fullName:"Tseung Kwan O Waterside",
    shortName:"TKO", estateName:"TKO Waterside Estate", estateNameTBC:false,
    locationUUID:"loc-uuid-004", leasePlanURL:null,
    stage:"qs_team_leader", status:"revision",
    nature:["residential"], revisions:[
      {
        revisionNo: 1,
        triggeredBy: "user-006",
        triggeredAt: "2026-05-20T09:00:00",
        reason: "GFA and residential unit count revised following updated building plans approved by BD. OP date adjusted to reflect revised construction programme.",
        summary: "Domestic GFA increased by ~800 sm following approved plan amendments. Tower unit count revised from 320 to 344. OP date pushed by 3 months.",
        affectedFields: ["sectionB.domesticGfaSM","sectionB.nonDomesticGfaSM","sectionB.gfaSM","sectionB.residentialUnits","sectionB.dates.occupationPermit","sectionB.dates.practicalCompletion"],
        hasCASensitiveChange: false,
        status: "in_progress",
        snapshot: {
          sectionB: {
            gfaSM:"48200", domesticGfaSM:"37400", nonDomesticGfaSM:"10800",
            residentialUnits:{ tower:"320", villa:"", house:"" },
            dates:{
              occupationPermit:    { target:"2027-09-30", actual:"" },
              practicalCompletion: { target:"2027-12-31", actual:"" },
            },
          },
          sectionC:{ typeOfContract:["inhouse"], paymentTerm:["monthly_progress"] },
          assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
        },
        changedFields:{
          "sectionB.gfaSM":                            { old:"48200",     new:"49600" },
          "sectionB.domesticGfaSM":                    { old:"37400",     new:"38200" },
          "sectionB.nonDomesticGfaSM":                 { old:"10800",     new:"11400" },
          "sectionB.dates.occupationPermit.target":    { old:"2027-09-30",new:"2027-12-31" },
          "sectionB.dates.practicalCompletion.target": { old:"2027-12-31",new:"2028-03-31" },
        },
        approvalHistory:[
          { stage:"engineer", action:"revision_submitted", userUUID:"user-006", timestamp:"2026-05-25T10:30:00", note:"Revision 1 submitted" },
        ],
      },
    ],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      siteAreaSM:"11800", siteAreaSF:"127014",
      gfaSM:"49600", gfaSF:"533882",
      domesticGfaSM:"38200", domesticGfaSF:"411215",
      nonDomesticGfaSM:"11400", nonDomesticGfaSF:"122709",
      constructionFloorAreaSM:"52000", constructionFloorAreaSF:"559723",
      natureOfProject:["residential"],
      noOfBlocksStorey:"3 Towers x 40 Storeys",
      residentialUnits:{ tower:"344", villa:"", house:"" },
      carpark:{ residential:"320", commercial:"40", visitor:"45", motorcycle:"50", bicycle:"140", loadingUnloading:"5", publicVehicle:"0", lgvHgvCoach:"3" },
      beamPlus:{ target:"Platinum", actual:"" },
      dates:{
        commencement:              { target:"2022-06-01", actual:"2022-06-15" },
        siteFormationCommencement: { target:"2022-03-01", actual:"2022-03-10" },
        capCommencement:           { target:"2022-09-01", actual:"2022-09-20" },
        occupationPermit:          { target:"2027-12-31", actual:"" },
        phasedOccupationPermit:    { target:"", actual:"" },
        practicalCompletion:       { target:"2028-03-31", actual:"" },
        sectionalCompletion:       { target:"", actual:"" },
        consentToAssign:           { target:"2028-06-30", actual:"" },
        certificateOfCompliance:   { target:"2028-09-30", actual:"" },
        buildingCovenant:          { target:"2028-09-30", actual:"" },
      },
      defectLiabilityPeriod:"3_years",
      projectPhasing:"Single phase",
      developer:"TKO Waterfront Properties Ltd",
      cpm:{ title:"Client Project Manager", name:"Henry Chu Pak Ho", email:"henrychu@tkowaterside.com" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"Farrells",
      architectureAP:{ name:"Peter Cookson Smith", bdCode:"BDAP" },
      rse:{ name:"Arup (HK) Ltd", bdCode:"BDRSE" },
      meConsultant:"Meinhardt (Hong Kong) Ltd",
      rge:{ name:"Ove Arup & Partners HK Ltd", bdCode:"BDRGE" },
      landscapeConsultant:"Belt Collins International Ltd",
      interiorDesigner:"",
      sustainabilityConsultant:"Ramboll BeamPlus Consultancy",
      qsConsultant:"Rider Levett Bucknall",
      otherConsultants:[{ title:"Traffic Consultant", name:"MVA Hong Kong" }],
      estateManagement:"TKO Property Management Ltd",
      mainContractor:"Hip Hing Construction Co. Ltd",
      contractorLicence:"HKBR-2021-05521",
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"Alice Leung" },
    },
    sectionC:{
      typeOfContract:["inhouse"],
      paymentTerm:["monthly_progress"],
      remarks:"Standard in-house contract. BeamPlus Platinum target requires enhanced M&E specifications.",
      qsTLSignedOff:true,
    },
    approvalHistory:[
      { stage:"engineer",       action:"submitted", userUUID:"user-006", timestamp:"2023-06-10T10:00:00", returnedToStage:null, note:"" },
      { stage:"qs_team_leader", action:"approved",  userUUID:"user-007", timestamp:"2023-06-18T09:30:00", returnedToStage:null, note:"" },
      { stage:"qs_manager",     action:"approved",  userUUID:"user-004", timestamp:"2023-06-25T11:00:00", returnedToStage:null, note:"" },
      { stage:"sic",            action:"approved",  userUUID:"user-005", timestamp:"2023-07-02T14:20:00", returnedToStage:null, note:"" },
      { stage:"pic",            action:"approved",  userUUID:"user-003", timestamp:"2023-07-08T16:00:00", returnedToStage:null, note:"" },
      { stage:"gm",             action:"approved",  userUUID:"user-002", timestamp:"2023-07-15T10:00:00", returnedToStage:null, note:"" },
      { stage:"engineer",       action:"revision_submitted", userUUID:"user-006", timestamp:"2026-05-25T10:30:00", returnedToStage:null, note:"Revision 1 submitted" },
    ],
    updatedAt:"2026-05-25T10:30:00", createdAt:"2022-11-01T09:00:00",
  },
  // ── uuid-008: complete stage, OP date passed — Project Status: OP
  {
    uuid:"uuid-008", siteCode:"2022-RES-YLP", fullName:"Yau Lei Path Residential",
    shortName:"YLP", estateName:"Yau Lei Path Estate", estateNameTBC:false,
    locationUUID:"loc-uuid-003", leasePlanURL:null,
    stage:"complete", status:"approved",
    nature:["residential"], revisions:[],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      siteAreaSM:"7800", siteAreaSF:"83958",
      gfaSM:"31200", gfaSF:"335836",
      domesticGfaSM:"28100", domesticGfaSF:"302472",
      nonDomesticGfaSM:"3100", nonDomesticGfaSF:"33368",
      constructionFloorAreaSM:"33800", constructionFloorAreaSF:"363854",
      natureOfProject:["residential"],
      noOfBlocksStorey:"2 Towers x 42 Storeys",
      residentialUnits:{ tower:"420", villa:"", house:"" },
      carpark:{ residential:"200", commercial:"20", visitor:"25", motorcycle:"30", bicycle:"80", loadingUnloading:"3", publicVehicle:"0", lgvHgvCoach:"2" },
      beamPlus:{ target:"Gold", actual:"Gold (Certified)" },
      dates:{
        commencement:              { target:"2022-03-01", actual:"2022-03-10" },
        siteFormationCommencement: { target:"2021-12-01", actual:"2021-12-15" },
        capCommencement:           { target:"2022-06-01", actual:"2022-06-08" },
        occupationPermit:          { target:"2026-03-31", actual:"2026-04-12" },
        phasedOccupationPermit:    { target:"", actual:"" },
        practicalCompletion:       { target:"2026-06-30", actual:"" },
        sectionalCompletion:       { target:"", actual:"" },
        consentToAssign:           { target:"2026-09-30", actual:"" },
        certificateOfCompliance:   { target:"2026-12-31", actual:"" },
        buildingCovenant:          { target:"2026-12-31", actual:"" },
      },
      defectLiabilityPeriod:"3_years",
      projectPhasing:"Single phase",
      developer:"Yau Lei Path Properties Ltd",
      cpm:{ title:"Client Project Manager", name:"Stanley Kwok Wai Man", email:"stanleykwok@ylp.com.hk" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"P&T Architects and Engineers Ltd",
      architectureAP:{ name:"Thomas Ng", bdCode:"BDAP" },
      rse:{ name:"Mott MacDonald Hong Kong Ltd", bdCode:"BDRSE" },
      meConsultant:"Parsons Brinckerhoff (HK) Ltd",
      rge:{ name:"Ove Arup & Partners HK Ltd", bdCode:"BDRGE" },
      landscapeConsultant:"ADI Ltd",
      interiorDesigner:"",
      sustainabilityConsultant:"Environ Hong Kong Ltd",
      qsConsultant:"Rider Levett Bucknall",
      otherConsultants:[],
      estateManagement:"Yau Lei Path Management Ltd",
      mainContractor:"China State Construction Eng. HK",
      contractorLicences:["HKBR-2023-06612"],
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"Alice Leung" },
    },
    sectionC:{ typeOfContract:["inhouse"], paymentTerm:["monthly_progress"], remarks:"", qsTLSignedOff:true },
    sectionD:{ financeProjectCode:"2022-YLP-001", subCodes:[
      { id:1, subCode:"001-A", description:"Main Contract — Residential" },
      { id:2, subCode:"002-A", description:"Professional Fees" },
    ]},
    postApprovalTasks:{ financeCodesStatus:"assigned", itSetupStatus:"complete" },
    approvalHistory:[
      { stage:"engineer",       action:"submitted", userUUID:"user-006", timestamp:"2022-06-01T10:00:00", returnedToStage:null, note:"" },
      { stage:"qs_team_leader", action:"approved",  userUUID:"user-007", timestamp:"2022-06-08T09:30:00", returnedToStage:null, note:"" },
      { stage:"qs_manager",     action:"approved",  userUUID:"user-004", timestamp:"2022-06-15T11:00:00", returnedToStage:null, note:"" },
      { stage:"sic",            action:"approved",  userUUID:"user-005", timestamp:"2022-06-20T14:20:00", returnedToStage:null, note:"" },
      { stage:"pic",            action:"approved",  userUUID:"user-003", timestamp:"2022-06-25T16:00:00", returnedToStage:null, note:"" },
      { stage:"gm",             action:"approved",  userUUID:"user-002", timestamp:"2022-07-02T10:00:00", returnedToStage:null, note:"" },
      { stage:"cost_account",   action:"submitted", userUUID:"user-008", timestamp:"2022-07-15T09:00:00", returnedToStage:null, note:"" },
      { stage:"it",             action:"completed", userUUID:"user-009", timestamp:"2022-08-01T09:00:00", returnedToStage:null, note:"Oracle project code 2022-YLP-001 activated." },
    ],
    updatedAt:"2022-08-01T09:00:00", createdAt:"2021-10-01T09:00:00",
  },
  // ── uuid-009: complete stage, CC date passed — Project Status: Complete
  {
    uuid:"uuid-009", siteCode:"2020-RES-STK", fullName:"Shatin Knoll Residences",
    shortName:"STK", estateName:"Shatin Knoll Estate", estateNameTBC:false,
    locationUUID:"loc-uuid-001", leasePlanURL:null,
    stage:"complete", status:"approved",
    nature:["residential"], revisions:[
      {
        revisionNo:1, triggeredBy:"user-006", triggeredAt:"2023-03-01T09:00:00",
        reason:"Main contractor changed from Gammon to Hip Hing following tender re-award. Payment term updated to reflect revised contract.",
        hasCASensitiveChange:true, status:"approved",
        snapshot:{ sectionB:{ mainContractor:"Gammon Construction Ltd" }, sectionC:{ paymentTerm:["scheduled"] }, assignedRoles:{} },
        changedFields:{
          "sectionB.mainContractor":    { old:"Gammon Construction Ltd", new:"Hip Hing Construction Co. Ltd" },
          "sectionC.paymentTerm":       { old:"scheduled",               new:"monthly_progress" },
        },
        approvalHistory:[{ stage:"gm", action:"revision_approved", userUUID:"user-002", timestamp:"2023-04-15T10:00:00", note:"Revision 1 approved" }],
      },
    ],
    assignedRoles:{ pic:"user-003", sic:"user-005", engineer:"user-006", qsManager:"user-004", qsTeamLeader:"user-007", costAccount:"user-008" },
    sectionB:{
      siteAreaSM:"14200", siteAreaSF:"152848",
      gfaSM:"56800", gfaSF:"611466",
      domesticGfaSM:"51100", domesticGfaSF:"549927",
      nonDomesticGfaSM:"5700", nonDomesticGfaSF:"61354",
      constructionFloorAreaSM:"60500", constructionFloorAreaSF:"651252",
      natureOfProject:["residential"],
      noOfBlocksStorey:"4 Towers x 40 Storeys",
      residentialUnits:{ tower:"780", villa:"", house:"" },
      carpark:{ residential:"420", commercial:"50", visitor:"55", motorcycle:"60", bicycle:"180", loadingUnloading:"6", publicVehicle:"0", lgvHgvCoach:"4" },
      beamPlus:{ target:"Gold", actual:"Gold (Certified)" },
      dates:{
        commencement:              { target:"2020-06-01", actual:"2020-06-15" },
        siteFormationCommencement: { target:"2020-03-01", actual:"2020-03-10" },
        capCommencement:           { target:"2020-09-01", actual:"2020-09-18" },
        occupationPermit:          { target:"2024-09-30", actual:"2024-10-15" },
        phasedOccupationPermit:    { target:"2024-06-30", actual:"2024-07-01" },
        practicalCompletion:       { target:"2024-12-31", actual:"2025-01-10" },
        sectionalCompletion:       { target:"2024-06-30", actual:"2024-07-01" },
        consentToAssign:           { target:"2025-03-31", actual:"2025-04-02" },
        certificateOfCompliance:   { target:"2025-09-30", actual:"2025-10-08" },
        buildingCovenant:          { target:"2025-09-30", actual:"2025-10-08" },
      },
      defectLiabilityPeriod:"3_years",
      projectPhasing:"Phase 1: Towers A+B (2020–2024) / Phase 2: Towers C+D (2021–2025)",
      developer:"Shatin Knoll Development Ltd",
      cpm:{ title:"Client Project Manager", name:"Victor Lee Kam Wah", email:"victorlee@stk.com.hk" },
      technicalDirector:{ name:"Fong Ching On Benjamin", bdCode:"BDTD" },
      authorisedSignatory:{ name:"Lau Siu Chuen Simmond", bdCode:"BDAS" },
      designArchitect:"Dennis Lau & Ng Chun Man Architects",
      architectureAP:{ name:"Dennis Lau", bdCode:"BDAP" },
      rse:{ name:"Arup (HK) Ltd", bdCode:"BDRSE" },
      meConsultant:"J. Roger Preston Ltd",
      rge:{ name:"Fugro Geotechnical Services", bdCode:"BDRGE" },
      landscapeConsultant:"Belt Collins International Ltd",
      interiorDesigner:"",
      sustainabilityConsultant:"Ramboll BeamPlus Consultancy",
      qsConsultant:"Davis Langdon & Seah Hong Kong Ltd",
      otherConsultants:[{ title:"Traffic Consultant", name:"MVA Hong Kong" }],
      estateManagement:"Shatin Property Management Services Ltd",
      mainContractor:"Hip Hing Construction Co. Ltd",
      contractorLicences:["HKBR-2021-05521"],
      costControlLeaders:{ accountingManager:"Kevin Tsang", qsManager:"Ho Yuk Ling", contractsManager:"Alice Leung" },
    },
    sectionC:{ typeOfContract:["inhouse"], paymentTerm:["monthly_progress"], remarks:"Phase 2 works under supplemental agreement.", qsTLSignedOff:true },
    sectionD:{ financeProjectCode:"2020-STK-001", subCodes:[
      { id:1, subCode:"001-A", description:"Main Contract — Phase 1" },
      { id:2, subCode:"001-B", description:"Main Contract — Phase 2" },
      { id:3, subCode:"002-A", description:"Professional Fees" },
    ]},
    postApprovalTasks:{ financeCodesStatus:"assigned", itSetupStatus:"complete" },
    approvalHistory:[
      { stage:"engineer",       action:"submitted", userUUID:"user-006", timestamp:"2020-08-10T10:00:00", returnedToStage:null, note:"" },
      { stage:"qs_team_leader", action:"approved",  userUUID:"user-007", timestamp:"2020-08-18T09:30:00", returnedToStage:null, note:"" },
      { stage:"qs_manager",     action:"approved",  userUUID:"user-004", timestamp:"2020-08-25T11:00:00", returnedToStage:null, note:"" },
      { stage:"sic",            action:"approved",  userUUID:"user-005", timestamp:"2020-09-01T14:20:00", returnedToStage:null, note:"" },
      { stage:"pic",            action:"approved",  userUUID:"user-003", timestamp:"2020-09-08T16:00:00", returnedToStage:null, note:"" },
      { stage:"gm",             action:"approved",  userUUID:"user-002", timestamp:"2020-09-15T10:00:00", returnedToStage:null, note:"" },
      { stage:"cost_account",   action:"submitted", userUUID:"user-008", timestamp:"2020-10-01T09:00:00", returnedToStage:null, note:"" },
      { stage:"it",             action:"completed", userUUID:"user-009", timestamp:"2020-10-15T09:00:00", returnedToStage:null, note:"Oracle project code 2020-STK-001 activated." },
    ],
    updatedAt:"2025-10-08T09:00:00", createdAt:"2020-01-15T09:00:00",
  },
];

let LOCATIONS_INIT = [
  { uuid:"loc-uuid-001", lotType:"DD",   lotNo:"254",   section:"", subSection:"", areaNo:"DD109",         streetNameNumber:"18 Tin Shui Road",       district:"Tin Shui Wai",  googleMapLink:"", remarks:"", linkedProjectUUIDs:["uuid-001","uuid-004"] },
  { uuid:"loc-uuid-002", lotType:"NKIL", lotNo:"6423",  section:"", subSection:"", areaNo:"",              streetNameNumber:"8 Kai Tak Avenue",        district:"Kowloon City",   googleMapLink:"", remarks:"", linkedProjectUUIDs:["uuid-002","uuid-005"] },
  { uuid:"loc-uuid-003", lotType:"KIL",  lotNo:"11205", section:"A", subSection:"", areaNo:"",             streetNameNumber:"23 Castle Peak Road",     district:"Tuen Mun",       googleMapLink:"", remarks:"", linkedProjectUUIDs:["uuid-003"] },
  { uuid:"loc-uuid-004", lotType:"DD",   lotNo:"",      section:"", subSection:"", areaNo:"DD221 Area 4",  streetNameNumber:"",                        district:"Sai Kung",       googleMapLink:"", remarks:"Lot number pending Lands Dept assignment", linkedProjectUUIDs:["uuid-007"] },
  { uuid:"loc-uuid-005", lotType:"IL",   lotNo:"8970",  section:"RP", subSection:"", areaNo:"",            streetNameNumber:"373 Queen's Road East",   district:"Wan Chai",       googleMapLink:"", remarks:"", linkedProjectUUIDs:["uuid-006"] },
];

const NOTIFICATIONS = {
  "user-001":[
    { title:"SKW awaiting Finance Codes", sub:"Sai Kung Waterfront — GM approved 15 Jan", unread:true },
    { title:"New project assigned",       sub:"Wan Wan Terrace — created 22 Feb",          unread:true },
    { title:"TMW reached GM stage",       sub:"Tuen Mun West Residences — 2 Jul 2025",     unread:false },
  ],
  "user-002":[
    { title:"TMW ready for GM sign-off",  sub:"Tuen Mun West Residences — PIC approved",   unread:true },
    { title:"KTD2 at QS Manager stage",   sub:"Kai Tak Development Phase 2",               unread:true },
    { title:"TPK — IT setup complete",    sub:"Tai Po Kau Mixed Development",              unread:false },
  ],
  "user-003":[
    { title:"WWT submitted by Engineer",  sub:"Wan Wan Terrace — awaiting your action",    unread:true },
    { title:"TMW awaiting PIC review",    sub:"Tuen Mun West Residences",                  unread:true },
  ],
  "user-004":[
    { title:"KTD2 at QS Manager stage",   sub:"Kai Tak Development Phase 2 — QS TL approved 2 Feb", unread:true },
    { title:"TMW approved at QS Manager", sub:"Tuen Mun West Residences",                  unread:false },
  ],
  "user-005":[
    { title:"TMW approved at SIC stage",  sub:"Tuen Mun West Residences",                  unread:false },
  ],
  "user-006":[
    { title:"WWT assigned to you",        sub:"Wan Wan Terrace — PIC assigned 22 Feb",     unread:true },
    { title:"KTD2 — data entry complete", sub:"Kai Tak Development Phase 2",               unread:false },
  ],
  "user-007":[
    { title:"WWT ready for QS TL input",  sub:"Wan Wan Terrace — Section C pending",       unread:true },
    { title:"KTD2 — Section C signed off",sub:"Kai Tak Development Phase 2",               unread:false },
  ],
  "user-008":[
    { title:"SKW — Finance Codes required",sub:"Sai Kung Waterfront — GM approved, awaiting input", unread:true },
  ],
  "user-009":[
    { title:"SKW — IT setup pending",     sub:"Sai Kung Waterfront — Cost Account submitted", unread:true },
  ],
};

// ─── helpers ───────────────────────────────────────────────────────────────
// LOCATIONS is managed as App state but also kept in sync here for getLoc/locPrimaryLabel
let LOCATIONS = [...LOCATIONS_INIT];
function getUser(uuid) { return USERS.find(u => u.uuid === uuid); }
function getLoc(uuid)  { return LOCATIONS.find(l => l.uuid === uuid); }
function fmtDate(iso)  {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}
function holderOf(project) {
  const uuid = STAGE_HOLDER_UUID[project.stage];
  return uuid ? getUser(uuid) : null;
}
function locPrimaryLabel(l) {
  if (!l) return "—";
  const t = l.lotType || l.ddType || "";
  if (t === "DD") {
    if (l.lotNo) return "Lot " + l.lotNo + " in " + (l.areaNo || "DD");
    return l.areaNo || "Lot No. pending";
  }
  if (t && l.lotNo) {
    const sec = l.section ? " " + l.section : "";
    return t + " " + l.lotNo + sec;
  }
  if (l.areaNo) return l.areaNo;
  return "Location ref. pending";
}

// ─── colour tokens ─────────────────────────────────────────────────────────
const C = {
  navy:    "#1e3a5f",
  midBlue: "#2d5a9e",
  page:    "#f1f5f9",
  border:  "#e2e8f0",
  card:    "#ffffff",
  textPri: "#0f172a",
  textSec: "#64748b",
  textDis: "#94a3b8",
  success: "#16a34a",
  warning: "#d97706",
  danger:  "#dc2626",
};

// ─── shared sub-components ─────────────────────────────────────────────────

function Avatar({ name, size = 30 }) {
  const ini = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: C.navy, color: "#fff",
      fontSize: size * 0.37, fontWeight: 600,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>{ini}</div>
  );
}

function StatusBadge({ stage, status }) {
  const isComplete = stage === "complete";
  const cfg = isComplete
    ? { bg:"#f0fdf4", color:"#166534", label:"Issued" }
    : status === "approved"
      ? { bg:"#dbeafe", color:"#1e40af", label:"System Setup" }
      : status === "revision"
        ? { bg:"#fef9c3", color:"#854d0e", label:"Revision in Progress" }
        : { bg:"#e0f2fe", color:"#0369a1", label:"In Approval" };
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      fontSize:11, fontWeight:500, padding:"2px 10px",
      borderRadius:10, background:cfg.bg, color:cfg.color,
      whiteSpace:"nowrap",
    }}>{cfg.label}</span>
  );
}

function Navbar({ currentUser, onSwitchUser, notifications }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications[currentUser.uuid] || []);
  const roleRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    setNotifs((notifications[currentUser.uuid] || []).map(n => ({ ...n })));
  }, [currentUser]);

  useEffect(() => {
    function handler(e) {
      if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const unreadCount = notifs.filter(n => n.unread).length;

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  }

  return (
    <nav style={{
      height: 56, background: "#fff", borderBottom: `1px solid ${C.border}`,
      display:"flex", alignItems:"center", padding:"0 20px", gap:16,
      flexShrink:0, zIndex:100, position:"relative",
    }}>
      <span style={{ fontSize:13, fontWeight:600, color:C.navy, whiteSpace:"nowrap" }}>
        Construction Co.
      </span>
      <span style={{ fontSize:15, fontWeight:600, color:C.textPri, flex:1, textAlign:"center" }}>
        Project Data Portal
      </span>
      <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>

        {/* Role switcher */}
        <div ref={roleRef} style={{ position:"relative" }}>
          <button
            onClick={e => { e.stopPropagation(); setRoleOpen(o => !o); setNotifOpen(false); }}
            style={{
              display:"flex", alignItems:"center", gap:6,
              background:"#fff", border:`1px solid ${C.border}`, borderRadius:6,
              padding:"5px 10px", cursor:"pointer", fontSize:12, color:C.textPri,
              fontFamily:"inherit",
            }}
          >
            <i className="ti ti-users" style={{ fontSize:14 }} aria-hidden="true" />
            {currentUser.name} · {ROLE_LABELS[currentUser.role]}
            <i className="ti ti-chevron-down" style={{ fontSize:12 }} aria-hidden="true" />
          </button>
          {roleOpen && (
            <div style={{
              position:"absolute", top:"calc(100% + 4px)", right:0,
              background:"#fff", border:`1px solid ${C.border}`, borderRadius:8,
              boxShadow:"0 8px 24px rgba(0,0,0,0.12)", width:240, zIndex:999, overflow:"hidden",
            }}>
              <div style={{ padding:"10px 14px", fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:`1px solid #f1f5f9` }}>
                Switch logged-in user
              </div>
              {USERS.map(u => (
                <button key={u.uuid}
                  onClick={() => { onSwitchUser(u.uuid); setRoleOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"9px 14px", cursor:"pointer", border:"none",
                    background: u.uuid === currentUser.uuid ? "#eff6ff" : "none",
                    width:"100%", textAlign:"left", fontFamily:"inherit",
                  }}
                >
                  <Avatar name={u.name} size={26} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:C.textPri }}>{u.name}</div>
                    <div style={{ fontSize:11, color:C.textSec }}>{ROLE_LABELS[u.role]}</div>
                  </div>
                  {u.uuid === currentUser.uuid && (
                    <i className="ti ti-check" style={{ marginLeft:"auto", color:C.navy, fontSize:14 }} aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bell */}
        <div ref={notifRef} style={{ position:"relative" }}>
          <button
            onClick={e => { e.stopPropagation(); setNotifOpen(o => !o); setRoleOpen(false); }}
            aria-label="Notifications"
            style={{ position:"relative", background:"none", border:"none", cursor:"pointer", padding:6, borderRadius:6, color:C.textSec, fontSize:18, display:"flex", alignItems:"center" }}
          >
            <i className="ti ti-bell" aria-hidden="true" />
            {unreadCount > 0 && (
              <span style={{
                position:"absolute", top:2, right:2, background:C.danger, color:"#fff",
                fontSize:10, fontWeight:600, width:16, height:16, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div style={{
              position:"absolute", top:"calc(100% + 8px)", right:0, width:340,
              background:"#fff", border:`1px solid ${C.border}`, borderRadius:10,
              boxShadow:"0 8px 24px rgba(0,0,0,0.12)", zIndex:999, overflow:"hidden",
            }}>
              <div style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:C.textPri, borderBottom:`1px solid #f1f5f9`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                Notifications
                <button onClick={markAllRead} style={{ fontSize:11, color:C.midBlue, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Mark all read</button>
              </div>
              {notifs.length === 0
                ? <div style={{ padding:20, textAlign:"center", fontSize:12, color:C.textDis }}>No notifications</div>
                : notifs.map((n, i) => (
                  <div key={i} style={{ padding:"10px 16px", borderBottom:"1px solid #f8fafc", cursor:"pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background=""}
                  >
                    <div style={{ display:"flex", gap:8 }}>
                      {n.unread
                        ? <div style={{ width:7, height:7, borderRadius:"50%", background:C.navy, flexShrink:0, marginTop:3 }} />
                        : <div style={{ width:7, flexShrink:0 }} />}
                      <div>
                        <div style={{ fontSize:12, fontWeight:500, color:C.textPri, marginBottom:2 }}>{n.title}</div>
                        <div style={{ fontSize:11, color:C.textSec }}>{n.sub}</div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* User info */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.textPri }}>{currentUser.name}</span>
          <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:"#dbeafe", color:"#1e40af", fontWeight:500 }}>
            {ROLE_LABELS[currentUser.role]}
          </span>
          <Avatar name={currentUser.name} size={30} />
        </div>
      </div>
    </nav>
  );
}

// ─── Screen 1: Project List ────────────────────────────────────────────────

// Project Status — derived from key dates vs today
function getProjectStatus(p) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = p.sectionB?.dates;
  if (!d) return "not_commenced";
  const parse = s => { if (!s) return null; const dt = new Date(s); dt.setHours(0,0,0,0); return dt; };
  const cc  = parse(d.certificateOfCompliance?.actual || d.certificateOfCompliance?.target);
  const op  = parse(d.occupationPermit?.actual        || d.occupationPermit?.target);
  const com = parse(d.commencement?.actual            || d.commencement?.target);
  if (cc  && cc  <= today) return "complete";
  if (op  && op  <= today) return "op";
  if (com && com <= today) return "commenced";
  return "not_commenced";
}

function ProjectStatusBadge({ ps }) {
  const cfg =
    ps === "complete"       ? { bg:"#e2e8f0", color:"#475569", label:"Complete" }
  : ps === "op"             ? { bg:"#fef9c3", color:"#854d0e", label:"OP" }
  : ps === "commenced"      ? { bg:"#dcfce7", color:"#15803d", label:"Commenced" }
  :                           { bg:"#f1f5f9", color:"#94a3b8", label:"Not Yet Commenced" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", fontSize:11, fontWeight:600,
      padding:"2px 9px", borderRadius:10, background:cfg.bg, color:cfg.color,
      whiteSpace:"nowrap" }}>
      {cfg.label}
    </span>
  );
}

function ProjectList({ currentUser, projects, onOpen, onNewProject }) {
  const [search,       setSearch]       = useState("");
  // "active" = all except complete (default)
  const [filterPS,     setFilterPS]     = useState("active");
  const [filterFS,     setFilterFS]     = useState("");
  const [filterNature, setFilterNature] = useState("");
  const [sortCol,      setSortCol]      = useState("commence");
  const [sortDir,      setSortDir]      = useState("asc");

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  const visible = projects.filter(p => {
    if (search && !p.fullName.toLowerCase().includes(search.toLowerCase()) &&
        !p.siteCode.toLowerCase().includes(search.toLowerCase())) return false;
    const ps = getProjectStatus(p);
    if      (filterPS === "active")        { if (ps === "complete") return false; }
    else if (filterPS === "commenced")     { if (ps !== "commenced") return false; }
    else if (filterPS === "op")            { if (ps !== "op") return false; }
    else if (filterPS === "not_commenced") { if (ps !== "not_commenced") return false; }
    else if (filterPS === "complete")      { if (ps !== "complete") return false; }
    if (filterFS) {
      if      (filterFS === "issued")      { if (p.stage !== "complete")       return false; }
      else if (filterFS === "in_progress") { if (p.status !== "in_progress")   return false; }
      else if (filterFS === "approved")    { if (p.status !== "approved")      return false; }
      else if (filterFS === "revision")    { if (p.status !== "revision")      return false; }
    }
    if (filterNature && !p.nature.includes(filterNature)) return false;
    return true;
  }).slice().sort((a, b) => {
    const psOrder = { commenced:0, op:1, not_commenced:2, complete:3 };
    if (sortCol === "projectStatus") {
      return sortDir === "asc"
        ? (psOrder[getProjectStatus(a)]??3) - (psOrder[getProjectStatus(b)]??3)
        : (psOrder[getProjectStatus(b)]??3) - (psOrder[getProjectStatus(a)]??3);
    }
    if (sortCol === "commence") {
      const av = a.sectionB?.dates?.commencement?.actual || a.sectionB?.dates?.commencement?.target || "";
      const bv = b.sectionB?.dates?.commencement?.actual || b.sectionB?.dates?.commencement?.target || "";
      if (!av && !bv) return 0;
      if (!av) return 1;
      if (!bv) return -1;
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    const av = a.updatedAt || "", bv = b.updatedAt || "";
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const isMO = currentUser.role === "mo_secretary";

  function getCommenceDate(p) {
    const d = p.sectionB?.dates?.commencement?.actual || p.sectionB?.dates?.commencement?.target;
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }); }
    catch { return d; }
  }

  const colGrid = "160px 100px 130px 1fr 100px 140px 50px 150px 90px";
  const thSt = { fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
    letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:3 };

  // Only Site Commence and Updated get sort arrows
  function SortTh({ col, label }) {
    const active = sortCol === col;
    return (
      <button onClick={() => handleSort(col)} style={{
        ...thSt, background:"none", border:"none", cursor:"pointer",
        fontFamily:"inherit", padding:0, color: active ? C.navy : C.textSec,
        display:"flex", alignItems:"center", gap:3,
      }}>
        {label}
        <span style={{
          fontSize:10, color: active ? C.navy : "#94a3b8",
          fontWeight:700, lineHeight:1, userSelect:"none",
        }}>
          {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    );
  }

  // Plain header — not sortable
  function Th({ children }) {
    return <div style={thSt}>{children}</div>;
  }

  const activeCount = projects.filter(p => getProjectStatus(p) !== "complete").length;

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:600, color:C.textPri, margin:0 }}>Projects</h1>
          <div style={{ fontSize:12, color:C.textSec, marginTop:2 }}>
            {activeCount} active project{activeCount !== 1 ? "s" : ""}
          </div>
        </div>
        {isMO && (
          <button onClick={onNewProject} style={{
            display:"flex", alignItems:"center", gap:6, background:C.navy, color:"#fff",
            border:"none", borderRadius:6, padding:"0 16px", height:36, fontSize:13,
            fontWeight:500, cursor:"pointer", fontFamily:"inherit",
          }}>
            <i className="ti ti-plus" style={{ fontSize:15 }} aria-hidden="true" />
            New Project
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8,
        padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <i className="ti ti-filter" style={{ fontSize:16, color:C.textSec }} aria-hidden="true" />
        <span style={{ fontSize:12, color:C.textSec, fontWeight:500 }}>Filter:</span>
        <div style={{ position:"relative" }}>
          <i className="ti ti-search" style={{ position:"absolute", left:8, top:"50%",
            transform:"translateY(-50%)", color:C.textDis, fontSize:14 }} aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or code…"
            style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px 5px 30px",
              fontSize:12, color:C.textPri, fontFamily:"inherit", height:32, minWidth:180 }} />
        </div>
        {/* Project Status filter with optgroup */}
        <select value={filterPS} onChange={e => setFilterPS(e.target.value)}
          style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px",
            fontSize:12, color:C.textPri, background:"#fff", fontFamily:"inherit",
            cursor:"pointer", height:32 }}>
          <option value="active">Active Projects (default)</option>
          <optgroup label="── Active sub-status ──">
            <option value="commenced">Commenced</option>
            <option value="op">OP</option>
            <option value="not_commenced">Not Yet Commenced</option>
          </optgroup>
          <option value="complete">Complete</option>
          <option value="">All Projects</option>
        </select>
        {/* Form Status */}
        <select value={filterFS} onChange={e => setFilterFS(e.target.value)}
          style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px",
            fontSize:12, color:C.textPri, background:"#fff", fontFamily:"inherit",
            cursor:"pointer", height:32 }}>
          <option value="">All Form Statuses</option>
          <option value="in_progress">In Approval</option>
          <option value="approved">System Setup</option>
          <option value="revision">Revision in Progress</option>
          <option value="issued">Issued</option>
        </select>
        <select value={filterNature} onChange={e => setFilterNature(e.target.value)}
          style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px",
            fontSize:12, color:C.textPri, background:"#fff", fontFamily:"inherit",
            cursor:"pointer", height:32 }}>
          <option value="">All Types</option>
          <option value="residential">Residential</option>
          <option value="office">Office</option>
          <option value="retail">Retail</option>
          <option value="hotel">Hotel</option>
          <option value="industrial">Industrial</option>
        </select>
        <button onClick={() => { setSearch(""); setFilterPS("active"); setFilterFS(""); setFilterNature(""); }}
          style={{ fontSize:12, color:C.midBlue, background:"none", border:"none",
            cursor:"pointer", padding:"4px 8px", borderRadius:4, fontFamily:"inherit" }}>
          Reset
        </button>
        <div style={{ marginLeft:"auto", fontSize:12, color:C.textSec }}>
          {visible.length} of {projects.length} projects
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8 }}>
        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:colGrid, padding:"10px 16px",
          borderBottom:`1px solid ${C.border}`, gap:12, alignItems:"center" }}>
          <Th>Project Status</Th>
          <SortTh col="commence" label="Site Commence" />
          <Th>Site Code</Th>
          <Th>Project Name</Th>
          <Th>Nature</Th>
          <Th>Form Status</Th>
          <Th>Rev.</Th>
          <Th>Current Holder</Th>
          <SortTh col="updatedAt" label="Updated" />
        </div>

        {visible.length === 0
          ? <div style={{ padding:48, textAlign:"center", color:C.textDis }}>
              <i className="ti ti-folder-off" style={{ fontSize:28, display:"block", marginBottom:8 }} aria-hidden="true" />
              No projects match the current filters.
            </div>
          : visible.map(p => {
              const holder = holderOf(p);
              const ps     = getProjectStatus(p);
              return (
                <div key={p.uuid} onClick={() => onOpen(p.uuid)}
                  style={{ display:"grid", gridTemplateColumns:colGrid,
                    padding:"11px 16px", borderBottom:"1px solid #f1f5f9",
                    gap:12, alignItems:"center", cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background=""}>
                  <div><ProjectStatusBadge ps={ps} /></div>
                  <div style={{ fontSize:12, color:C.textSec }}>{getCommenceDate(p)}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:C.navy,
                    fontFamily:"'SF Mono',Consolas,monospace" }}>{p.siteCode}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:C.textPri }}>{p.fullName}</div>
                    <div style={{ fontSize:11, color:C.textSec, marginTop:1 }}>{p.shortName}</div>
                  </div>
                  <div>
                    {(p.nature||[]).map(n => (
                      <span key={n} style={{ fontSize:11, padding:"1px 7px", borderRadius:10,
                        background:"#f1f5f9", color:"#475569", fontWeight:500,
                        display:"inline-block", marginRight:3 }}>
                        {n.charAt(0).toUpperCase()+n.slice(1)}
                      </span>
                    ))}
                  </div>
                  <div><StatusBadge stage={p.stage} status={p.status} /></div>
                  <div style={{ fontSize:12, color:C.textSec }}>
                    {(p.revisions||[]).length === 0
                      ? <span style={{ color:C.textDis }}>—</span>
                      : <span style={{ fontWeight:600, color:p.status==="revision"?C.warning:C.textSec }}>
                          Rev.{(p.revisions||[]).length}
                        </span>}
                  </div>
                  <div>
                    <div style={{ fontSize:12, color:C.textPri }}>{holder ? holder.name : "—"}</div>
                    {holder && <div style={{ fontSize:11, color:C.textSec }}>{ROLE_LABELS[holder.role]}</div>}
                  </div>
                  <div style={{ fontSize:11, color:C.textSec }}>{fmtDate(p.updatedAt)}</div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

// ─── Screen 1: Sidebar ────────────────────────────────────────────────────

function Sidebar({ currentUser, activeKey, onNav, collapsed, onToggle }) {
  const isMO    = currentUser.role === "mo_secretary";
  const isAdmin = currentUser.role === "system_admin";
  // tooltip: { label, y } — fixed-position tooltip state
  const [tooltip, setTooltip] = useState(null);

  const ICONS = {
    sites: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    locations: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-8-6.5-8-12a8 8 0 1 1 16 0c0 5.5-8 12-8 12z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    reports: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M8 17V13M12 17V8M16 17v-4"/>
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    chevronLeft: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    ),
    chevronRight: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
    lock: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  };

  const items = [
    { svg:"sites",     label:"Sites",     key:"sites" },
    { svg:"locations", label:"Locations", key:"locations", locked:!(isMO||isAdmin) },
    { svg:"reports",   label:"Reports",   key:"reports" },
    { svg:"settings",  label:"Settings",  key:"settings",  locked:!isAdmin },
  ];

  const COLLAPSED_W = 56;
  const EXPANDED_W  = 216;

  function showTooltip(e, label, extra) {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, extra, y: rect.top + rect.height / 2 });
  }
  function hideTooltip() { setTooltip(null); }

  return (
    <>
      {/* Fixed tooltip — rendered outside sidebar so overflow:hidden can't clip it */}
      {tooltip && (
        <div style={{
          position: "fixed",
          left: COLLAPSED_W + 10,
          top: tooltip.y,
          transform: "translateY(-50%)",
          background: "#1e293b",
          color: "#f1f5f9",
          fontSize: 12,
          fontWeight: 500,
          padding: "5px 10px",
          borderRadius: 6,
          whiteSpace: "nowrap",
          zIndex: 99999,
          pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
        }}>
          {tooltip.label}
          {tooltip.extra && <span style={{ opacity:0.55, marginLeft:6, fontSize:11 }}>{tooltip.extra}</span>}
          {/* Left arrow */}
          <div style={{
            position:"absolute", left:-5, top:"50%", transform:"translateY(-50%)",
            width:0, height:0,
            borderTop:"5px solid transparent",
            borderBottom:"5px solid transparent",
            borderRight:"5px solid #1e293b",
          }} />
        </div>
      )}

      <aside style={{
        width: collapsed ? COLLAPSED_W : EXPANDED_W,
        minWidth: collapsed ? COLLAPSED_W : EXPANDED_W,
        background: C.navy,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflowY: "auto",
        overflowX: "hidden",
      }}>
        <nav style={{ padding:"8px 0", flex:1 }}>
          {items.map(item => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => !item.locked && onNav(item.key)}
                onMouseEnter={e => showTooltip(e, item.label, item.locked ? "(restricted)" : null)}
                onMouseLeave={hideTooltip}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: 10,
                  width: "100%",
                  height: 42,
                  padding: collapsed ? "0" : "0 16px",
                  border: "none",
                  borderLeft: isActive ? "3px solid #7dd3fc" : "3px solid transparent",
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  color: item.locked
                    ? "rgba(148,163,184,0.4)"
                    : isActive ? "#fff" : "#94a3b8",
                  cursor: item.locked ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  boxSizing: "border-box",
                }}
              >
                <span style={{
                  flexShrink:0, width:20, height:20,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {ICONS[item.svg]}
                </span>
                {!collapsed && (
                  <span style={{ flex:1, textAlign:"left", overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && item.locked && (
                  <span style={{ marginLeft:"auto", opacity:0.4 }}>{ICONS.lock}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle + version */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: collapsed ? "10px 0" : "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}>
          {!collapsed && (
            <span style={{ fontSize:10, color:"rgba(148,163,184,0.4)", letterSpacing:"0.04em" }}>
              v0.1
            </span>
          )}
          <button
            onClick={onToggle}
            onMouseEnter={e => showTooltip(e, collapsed ? "Expand" : "Collapse")}
            onMouseLeave={hideTooltip}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              cursor: "pointer",
              width: 28, height: 28,
              display:"flex", alignItems:"center", justifyContent:"center",
              color: "#64748b",
            }}
          >
            {collapsed ? ICONS.chevronRight : ICONS.chevronLeft}
          </button>
        </div>
      </aside>
    </>
  );
}
// ─── Stepper sidebar widget ────────────────────────────────────────────────

function Stepper({ currentStage }) {
  const phase1 = ["mo_secretary","delegation","engineer","qs_team_leader","qs_manager","sic","pic","gm"];
  const phase2 = ["cost_account","it","complete"];
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  function Item({ stage }) {
    const idx = STAGE_ORDER.indexOf(stage);
    const state = idx < currentIdx ? "done" : idx === currentIdx ? "current" : "pending";
    const dotColor = state==="done" ? C.success : state==="current" ? C.navy : C.border;
    const textColor = state==="done" ? C.success : state==="current" ? C.navy : C.textDis;
    const fontWeight = state==="current" ? 600 : 400;
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"3px 0" }}>
        <div style={{
          width:10, height:10, borderRadius:"50%", flexShrink:0, background:dotColor,
          boxShadow: state==="current" ? `0 0 0 3px rgba(30,58,95,0.18)` : "none",
        }} />
        <span style={{ fontSize:12, color:textColor, fontWeight }}>{STAGE_LABEL[stage]}</span>
      </div>
    );
  }

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:8 }}>Approval Progress</div>
      {phase1.map(s => <Item key={s} stage={s} />)}
      <div style={{ fontSize:10, fontWeight:600, color:C.textDis, textTransform:"uppercase", letterSpacing:"0.06em", margin:"8px 0 4px 18px" }}>Post-Approval</div>
      {phase2.map(s => <Item key={s} stage={s} />)}
    </div>
  );
}

// ─── Screen 2: Section A ───────────────────────────────────────────────────

// ─── HK Lot Types (Land Registry IRIS) ────────────────────────────────────
const LOT_TYPES = [
  { group:"Hong Kong Island",    types:[
    { code:"IL",    label:"IL — Inland Lot" },
    { code:"ML",    label:"ML — Marine Lot" },
    { code:"RBL",   label:"RBL — Rural Building Lot" },
  ]},
  { group:"Kowloon",             types:[
    { code:"KIL",   label:"KIL — Kowloon Inland Lot" },
    { code:"NKIL",  label:"NKIL — New Kowloon Inland Lot" },
  ]},
  { group:"New Territories — Rural", types:[
    { code:"DD",    label:"DD — Demarcation District Lot" },
  ]},
  { group:"New Territories — Town Lots", types:[
    { code:"STTL",  label:"STTL — Sha Tin Town Lot" },
    { code:"TPTL",  label:"TPTL — Tai Po Town Lot" },
    { code:"TWTL",  label:"TWTL — Tsuen Wan Town Lot" },
    { code:"TMTL",  label:"TMTL — Tuen Mun Town Lot" },
    { code:"YLTL",  label:"YLTL — Yuen Long Town Lot" },
    { code:"TSWTL", label:"TSWTL — Tin Shui Wai Town Lot" },
    { code:"TKTL",  label:"TKTL — Tseung Kwan O Town Lot" },
    { code:"FSITL", label:"FSITL — Fanling / Sheung Shui Inland Lot" },
    { code:"HSKTL", label:"HSKTL — Hung Shui Kiu Town Lot" },
  ]},
];

const HK_DISTRICTS = [
  "Central & Western","Wan Chai","Eastern","Southern",
  "Yau Tsim Mong","Sham Shui Po","Kowloon City","Wong Tai Sin","Kwun Tong",
  "Kwai Tsing","Tsuen Wan","Tuen Mun","Yuen Long","North","Tai Po",
  "Sha Tin","Sai Kung","Islands",
];

// ─── New Location Modal ────────────────────────────────────────────────────
// Lot type → district auto-fill mapping
const LOT_TYPE_DISTRICT = {
  // Town lots: 1:1 mapping
  STTL:  "Sha Tin",       TPTL:  "Tai Po",        TWTL:  "Tsuen Wan",
  TMTL:  "Tuen Mun",      YLTL:  "Yuen Long",     TSWTL: "Yuen Long",
  TKTL:  "Sai Kung",      FSITL: "North",          HSKTL: "Yuen Long",
  // Urban lots: suggest filtered list (handled separately)
};
const LOT_TYPE_DISTRICT_HINTS = {
  IL:   ["Central & Western","Wan Chai","Eastern","Southern"],
  ML:   ["Central & Western","Wan Chai","Eastern","Southern"],
  RBL:  ["Central & Western","Wan Chai","Eastern","Southern"],
  KIL:  ["Yau Tsim Mong","Sham Shui Po","Kowloon City"],
  NKIL: ["Wong Tai Sin","Kwun Tong","Sham Shui Po","Kowloon City"],
  DD:   null, // DD number-dependent, no auto-fill
};

function parseGoogleMapEmbed(url) {
  if (!url) return null;
  // Accept maps.google.com, goo.gl/maps, maps.app.goo.gl
  const isValid = /maps\.google\.com|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url);
  if (!isValid) return null;
  // Build embed URL: use the /maps/embed/v1 approach won't work without API key
  // Instead use the no-key embed: maps.google.com/maps?q=URL&output=embed
  // For share links like maps.app.goo.gl, we embed via the URL itself
  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed&hl=en`;
}

function NewLocationModal({ onClose, onCreated }) {
  const BLANK = {
    lotType:"", lotNo:"", section:"", subSection:"", areaNo:"",
    streetNameNumber:"", district:"", googleMapLink:"", remarks:"",
  };
  const [form, setForm] = useState(BLANK);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [mapEmbedUrl, setMapEmbedUrl] = useState(null);
  const [urlError, setUrlError] = useState("");
  const [csdiStatus, setCsdiStatus] = useState("idle"); // idle | loading | found | notfound | error
  const [csdiResult, setCsdiResult] = useState(null);

  const hasLotIdentifier = !!(form.lotType && form.lotNo);
  const hasAreaFallback  = !!form.areaNo;

  // District suggestions based on lot type
  const autoDistrict   = LOT_TYPE_DISTRICT[form.lotType] || null;
  const hintDistricts  = LOT_TYPE_DISTRICT_HINTS[form.lotType] || null;
  const filteredDistricts = hintDistricts
    ? HK_DISTRICTS.filter(d => hintDistricts.includes(d))
    : HK_DISTRICTS;

  const missing = [];
  if (!hasLotIdentifier && !hasAreaFallback) missing.push("Lot Type + Lot No., or Area Reference");
  if (!form.district)         missing.push("District");
  if (!form.streetNameNumber) missing.push("Street Name / Number");
  if (!form.googleMapLink)    missing.push("Google Map Link");
  if (urlError)               missing.push("Valid Google Map URL");
  const canSubmit = missing.length === 0;

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleLotTypeChange(val) {
    set("lotType", val);
    const auto = LOT_TYPE_DISTRICT[val];
    if (auto) set("district", auto);
    // Reset CSDI result when lot type changes
    setCsdiStatus("idle"); setCsdiResult(null);
  }

  async function handleCsdiLookup() {
    if (!form.lotType || !form.lotNo) return;
    // Format: "IL 8970", "NKIL 6423", "KIL 11205 A" etc.
    const searchText = [form.lotType, form.lotNo, form.section].filter(Boolean).join(" ");
    setCsdiStatus("loading"); setCsdiResult(null);
    try {
      // CSDI Land Parcel Search API — public, no key required
      const url = `https://mapapi.geodata.gov.hk/gs/api/v1.0.0/lus/lot/SearchNumber?text=${encodeURIComponent(searchText)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error " + res.status);
      const data = await res.json();
      // Response has SpatialFeature array
      const features = data?.SpatialFeature || data?.features || [];
      if (!features.length) {
        setCsdiStatus("notfound"); return;
      }
      const first = features[0];
      // Extract address info — structure varies, try common paths
      const props = first.properties || first.Properties || {};
      const addr = props.addressEN || props.address || props.Address || "";
      const district = props.districtEN || props.District || props.district || "";
      const lat = first.geometry?.coordinates?.[1] || props.y || null;
      const lng = first.geometry?.coordinates?.[0] || props.x || null;
      setCsdiResult({ addr, district, lat, lng, raw: first });
      setCsdiStatus("found");
      // Auto-fill street if found and not already set
      if (addr && !form.streetNameNumber) set("streetNameNumber", addr);
      if (district && !form.district) set("district", district);
    } catch (err) {
      // CORS or network error — expected in sandbox
      setCsdiStatus("error");
      setCsdiResult({ corsError: true });
    }
  }

  function handleGoogleMapChange(val) {
    set("googleMapLink", val);
    if (!val) { setUrlError(""); setMapEmbedUrl(null); return; }
    const isValid = /maps\.google\.com|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(val);
    if (!isValid) {
      setUrlError("Please enter a Google Maps URL (maps.google.com, goo.gl/maps, or maps.app.goo.gl)");
      setMapEmbedUrl(null);
    } else {
      setUrlError("");
      setMapEmbedUrl(parseGoogleMapEmbed(val));
    }
  }

  function handleCreate() {
    if (!canSubmit) { setSubmitAttempted(true); return; }
    const newLoc = {
      uuid: "loc-" + Date.now(),
      lotType: form.lotType, lotNo: form.lotNo,
      section: form.section, subSection: form.subSection,
      areaNo: form.areaNo, streetNameNumber: form.streetNameNumber,
      district: form.district, googleMapLink: form.googleMapLink,
      remarks: form.remarks, linkedProjectUUIDs: [],
    };
    LOCATIONS = [...LOCATIONS, newLoc];
    onCreated(newLoc);
  }

  const inp = (disabled=false) => ({
    height:36, border:`1px solid ${disabled ? "#e8edf2" : C.border}`, borderRadius:6,
    padding:"0 10px", fontSize:13,
    color: disabled ? "#b0bec5" : C.textPri,
    fontFamily:"inherit", background: disabled ? "#f4f6f8" : "#fff",
    width:"100%", boxSizing:"border-box",
    cursor: disabled ? "not-allowed" : "text",
    opacity: disabled ? 0.7 : 1,
  });
  const lbl = (text, req=false, note="") => (
    <label style={{ fontSize:12, fontWeight:500, color:C.textSec, marginBottom:5, display:"block" }}>
      {req && <span style={{ color:C.danger, marginRight:2 }}>*</span>}
      {text}
      {note && <span style={{ color:C.textDis, fontWeight:400, marginLeft:5, fontSize:11 }}>{note}</span>}
    </label>
  );
  const notRequired = (text) => (
    <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5, fontSize:11, color:"#94a3b8" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
      </svg>
      {text}
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:10000,
      background:"rgba(15,23,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:12, width:580, maxWidth:"calc(100vw - 40px)",
        maxHeight:"calc(100vh - 60px)", overflow:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#fff", zIndex:1 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:C.textPri }}>New Location Entry</div>
            <div style={{ fontSize:12, color:C.textSec, marginTop:2 }}>
              Added to Location Registry and auto-selected for this project
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer",
            fontSize:22, color:C.textDis, lineHeight:1, padding:4 }}>×</button>
        </div>

        <div style={{ padding:"20px 24px" }}>

          {/* ── Lot Identification ── */}
          <div style={{ background:"#f8fafc", border:`1px solid ${C.border}`, borderRadius:8,
            padding:"14px 16px", marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textSec, marginBottom:12,
              textTransform:"uppercase", letterSpacing:"0.06em" }}>Lot Identification</div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div style={{ opacity: hasAreaFallback ? 0.5 : 1 }}>
                {lbl("Lot Type", !hasAreaFallback)}
                <select value={form.lotType} disabled={hasAreaFallback}
                  onChange={e => handleLotTypeChange(e.target.value)}
                  style={{ ...inp(hasAreaFallback), cursor: hasAreaFallback ? "not-allowed" : "pointer" }}>
                  <option value="">— Select —</option>
                  {LOT_TYPES.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.types.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
                    </optgroup>
                  ))}
                </select>
                {hasAreaFallback && notRequired("Not required — Area Reference filled")}
              </div>
              <div style={{ opacity: hasAreaFallback ? 0.5 : 1 }}>
                {lbl("Lot No.", !hasAreaFallback)}
                <input value={form.lotNo} disabled={hasAreaFallback}
                  onChange={e => { set("lotNo", e.target.value); setCsdiStatus("idle"); setCsdiResult(null); }}
                  placeholder="e.g. 6423, 11205" style={inp(hasAreaFallback)} />
                {hasAreaFallback && notRequired("Not required — Area Reference filled")}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                {lbl("Section")}
                <input value={form.section} onChange={e => { set("section", e.target.value); setCsdiStatus("idle"); }}
                  placeholder="e.g. A, RP" style={inp()} />
              </div>
              <div>
                {lbl("Sub-section")}
                <input value={form.subSection} onChange={e => set("subSection", e.target.value)}
                  placeholder="Optional" style={inp()} />
              </div>
            </div>

            {/* CSDI Lookup button */}
            {hasLotIdentifier && (
              <div style={{ marginBottom:12 }}>
                <button
                  onClick={handleCsdiLookup}
                  disabled={csdiStatus === "loading"}
                  style={{ display:"flex", alignItems:"center", gap:6,
                    background: csdiStatus === "loading" ? "#f1f5f9" : "#eff6ff",
                    color: csdiStatus === "loading" ? C.textDis : C.midBlue,
                    border:`1px solid ${csdiStatus === "loading" ? C.border : "#bfdbfe"}`,
                    borderRadius:6, padding:"0 12px", height:32, fontSize:12,
                    fontWeight:500, cursor: csdiStatus === "loading" ? "wait" : "pointer",
                    fontFamily:"inherit" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  {csdiStatus === "loading" ? "Looking up…" : "Look up address via CSDI"}
                </button>
                <div style={{ fontSize:10, color:C.textDis, marginTop:4 }}>
                  Queries HK Lands Department open data API (CSDI) to auto-fill street &amp; district
                </div>

                {/* CSDI result */}
                {csdiStatus === "found" && csdiResult && (
                  <div style={{ marginTop:8, background:"#f0fdf4", border:"1px solid #86efac",
                    borderRadius:6, padding:"10px 12px", fontSize:12 }}>
                    <div style={{ fontWeight:600, color:"#15803d", marginBottom:4, display:"flex", alignItems:"center", gap:6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
                      </svg>
                      Address found via CSDI
                    </div>
                    {csdiResult.addr && <div style={{ color:"#166534" }}>Street: <strong>{csdiResult.addr}</strong></div>}
                    {csdiResult.district && <div style={{ color:"#166534", marginTop:2 }}>District: <strong>{csdiResult.district}</strong></div>}
                    <div style={{ color:"#94a3b8", marginTop:6, fontSize:11 }}>
                      Fields auto-filled above where empty. Verify accuracy before saving.
                    </div>
                  </div>
                )}

                {csdiStatus === "notfound" && (
                  <div style={{ marginTop:8, background:"#fffbeb", border:"1px solid #fde68a",
                    borderRadius:6, padding:"8px 12px", fontSize:11, color:"#92400e" }}>
                    Lot not found in CSDI database. Please fill street and district manually.
                  </div>
                )}

                {csdiStatus === "error" && csdiResult?.corsError && (
                  <div style={{ marginTop:8, background:"#f8fafc", border:`1px solid ${C.border}`,
                    borderRadius:6, padding:"8px 12px", fontSize:11, color:C.textSec }}>
                    <strong>CSDI lookup unavailable in prototype</strong> — cross-origin request blocked by browser sandbox.
                    This feature will work in production deployment. Please fill address manually.
                  </div>
                )}

                {csdiStatus === "error" && !csdiResult?.corsError && (
                  <div style={{ marginTop:8, background:"#fff5f5", border:"1px solid #fca5a5",
                    borderRadius:6, padding:"8px 12px", fontSize:11, color:C.danger }}>
                    Lookup failed — API may be temporarily unavailable. Please fill address manually.
                  </div>
                )}
              </div>
            )}

            {/* Area Reference — greyed when lot is identified */}
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              <div style={{ fontSize:11, color:C.textSec, marginBottom:8, lineHeight:1.5 }}>
                <strong>If Lot No. not yet assigned</strong> — enter Area reference. Lot Type &amp; No. can be updated later.
              </div>
              <div style={{ opacity: hasLotIdentifier ? 0.45 : 1 }}>
                {lbl("Area Reference", !hasLotIdentifier)}
                <input value={form.areaNo} disabled={hasLotIdentifier}
                  onChange={e => set("areaNo", e.target.value)}
                  placeholder="e.g. DD221 Area 4, Area 108A Tin Shui Wai"
                  style={inp(hasLotIdentifier)} />
                {hasLotIdentifier && notRequired("Not required — Lot Type & No. already filled")}
              </div>
            </div>
          </div>

          {/* ── Address ── */}
          <div style={{ marginBottom:14 }}>
            {lbl("Street Name / Number", true, "(open question: mandatory for demo)")}
            <input value={form.streetNameNumber} onChange={e => set("streetNameNumber", e.target.value)}
              placeholder="e.g. 18 Tin Shui Road" style={inp()} />
          </div>

          <div style={{ marginBottom:18 }}>
            {lbl("District", true, "(open question: mandatory for demo)")}
            {autoDistrict && (
              <div style={{ fontSize:11, color:"#16a34a", fontWeight:500, marginBottom:5,
                display:"flex", alignItems:"center", gap:4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
                </svg>
                Auto-filled from Lot Type ({form.lotType})
              </div>
            )}
            {hintDistricts && !autoDistrict && (
              <div style={{ fontSize:11, color:C.midBlue, marginBottom:5 }}>
                Showing districts for {form.lotType} lots — or select any district
              </div>
            )}
            <select value={form.district} onChange={e => set("district", e.target.value)}
              style={{ ...inp(), cursor:"pointer" }}>
              <option value="">— Select district —</option>
              {hintDistricts && !autoDistrict ? (<>
                <optgroup label={`Typical for ${form.lotType}`}>
                  {filteredDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </optgroup>
                <optgroup label="All districts">
                  {HK_DISTRICTS.filter(d => !filteredDistricts.includes(d)).map(d => <option key={d} value={d}>{d}</option>)}
                </optgroup>
              </>) : (
                HK_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)
              )}
            </select>
          </div>

          {/* ── Google Map ── */}
          <div style={{ marginBottom:14 }}>
            {lbl("Google Map Link", true, "(open question: mandatory for demo)")}
            <input value={form.googleMapLink}
              onChange={e => handleGoogleMapChange(e.target.value)}
              placeholder="https://maps.google.com/maps?q=… or https://goo.gl/maps/…"
              style={{ ...inp(), borderColor: urlError ? C.danger : C.border }} />
            {urlError && (
              <div style={{ fontSize:11, color:C.danger, marginTop:4 }}>{urlError}</div>
            )}
            {mapEmbedUrl && (
              <div style={{ marginTop:8, borderRadius:7, border:`1px solid #86efac`,
                background:"#f0fdf4", padding:"10px 12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
                  </svg>
                  <span style={{ fontSize:12, fontWeight:600, color:"#15803d" }}>Valid Google Maps link</span>
                  <a href={form.googleMapLink} target="_blank" rel="noreferrer"
                    style={{ marginLeft:"auto", fontSize:11, color:C.midBlue, display:"flex", alignItems:"center", gap:3 }}>
                    Open in Maps
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
                <div style={{ fontSize:11, color:"#166534", fontStyle:"italic",
                  borderTop:"1px solid #bbf7d0", paddingTop:6, marginTop:2 }}>
                  🗺 Map preview not shown in prototype — requires Google Maps API key in production.
                  Use "Open in Maps" above to verify the location.
                </div>
              </div>
            )}
          </div>

          {/* ── Remarks ── */}
          <div style={{ marginBottom:4 }}>
            {lbl("Remarks")}
            <textarea value={form.remarks} onChange={e => set("remarks", e.target.value)}
              rows={2} placeholder="Optional notes about this location…"
              style={{ width:"100%", boxSizing:"border-box", border:`1px solid ${C.border}`,
                borderRadius:6, padding:"8px 10px", fontSize:13, fontFamily:"inherit",
                color:C.textPri, resize:"vertical" }} />
          </div>

          {/* Missing fields */}
          {submitAttempted && missing.length > 0 && (
            <div style={{ background:"#fff5f5", border:"1px solid #fca5a5", borderRadius:6,
              padding:"10px 14px", marginTop:12 }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.danger, marginBottom:4 }}>
                Please complete required fields:
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {missing.map(f => (
                  <span key={f} style={{ fontSize:11, padding:"2px 8px", borderRadius:4,
                    background:"#fee2e2", color:C.danger, border:"1px solid #fca5a5" }}>{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 24px 20px", borderTop:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", gap:10,
          position:"sticky", bottom:0, background:"#fff" }}>
          <button onClick={handleCreate}
            style={{ background:canSubmit ? C.navy : "#94a3b8", color:"#fff",
              border:"none", borderRadius:6, padding:"0 20px", height:38,
              fontSize:13, fontWeight:500, cursor: canSubmit ? "pointer" : "not-allowed",
              fontFamily:"inherit" }}>
            Create Location
          </button>
          <button onClick={onClose}
            style={{ background:"#fff", color:C.textSec, border:`1px solid ${C.border}`,
              borderRadius:6, padding:"0 16px", height:38, fontSize:13,
              cursor:"pointer", fontFamily:"inherit" }}>
            Cancel
          </button>
          {!canSubmit && submitAttempted && (
            <span style={{ fontSize:12, color:C.textSec }}>
              {missing.length} field{missing.length > 1 ? "s" : ""} need attention
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionA({ currentUser, project, onBack, onSubmitted }) {
  const isMO  = currentUser.role === "mo_secretary";
  const isPIC = currentUser.role === "pic" || currentUser.uuid === project.assignedRoles?.pic;
  const isQSM = currentUser.role === "qs_manager" || currentUser.uuid === project.assignedRoles?.qsManager;

  const canViewThisScreen = isMO || isPIC || isQSM;

  const loc = getLoc(project.locationUUID);

  const [form, setForm] = useState({
    siteCode:      project.siteCode      || "",
    fullName:      project.fullName      || "",
    shortName:     project.shortName     || "",
    estateName:    project.estateName    || "",
    estateNameTBC: project.estateNameTBC || false,
    locationUUID:  project.locationUUID  || null,
    leasePlanURL:  project.leasePlanURL  || null,
    assignedPIC:   project.assignedRoles?.pic       || "",
    assignedQSMgr: project.assignedRoles?.qsManager || "",
  });

  // Delegation assignment state — PIC assigns SIC + Engineer, QSM assigns QS TL
  const [picPending, setPicPending] = useState({
    sic:      project.assignedRoles?.sic      || "",
    engineer: project.assignedRoles?.engineer || "",
  });
  const [qsmPending, setQsmPending] = useState({
    qsTeamLeader: project.assignedRoles?.qsTeamLeader || "",
  });
  const [picLocked, setPicLocked]   = useState(!!(project.assignedRoles?.sic && project.assignedRoles?.engineer));
  const [qsmLocked, setQsmLocked]   = useState(!!project.assignedRoles?.qsTeamLeader);
  const [picEditing, setPicEditing] = useState(false);
  const [qsmEditing, setQsmEditing] = useState(false);

  const [locSearch, setLocSearch]         = useState("");
  const [locDropOpen, setLocDropOpen]     = useState(false);
  const [showNewLocModal, setShowNewLocModal] = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [savedBanner, setSavedBanner]     = useState(""); // "" | "submitted" | "saved" | "assigned"
  const locRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (locRef.current && !locRef.current.contains(e.target)) setLocDropOpen(false);
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const activeLoc = getLoc(form.locationUUID);

  const locMatches = LOCATIONS.filter(l => {
    const q = locSearch.toLowerCase();
    return !q
      || (l.lotNo && l.lotNo.toLowerCase().includes(q))
      || (l.streetNameNumber && l.streetNameNumber.toLowerCase().includes(q))
      || (l.district && l.district.toLowerCase().includes(q))
      || (l.areaNo && l.areaNo.toLowerCase().includes(q))
      || (l.lotType && l.lotType.toLowerCase().includes(q));
  });

  const picUsers = USERS.filter(u => u.role === "pic");
  const qsmUsers = USERS.filter(u => u.role === "qs_manager");
  const engineerUsers = USERS.filter(u => u.role === "engineer");
  const sicUsers      = USERS.filter(u => u.role === "sic");
  const qsTLUsers     = USERS.filter(u => u.role === "qs_team_leader");

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  // MO Secretary save / submit
  function handleMOSubmit() {
    if (!form.siteCode.trim()) { alert("Site Code is required."); return; }
    const isFirstSubmit = project.stage === "mo_secretary";
    const updated = {
      ...project, ...form,
      stage: isFirstSubmit ? "delegation" : project.stage,
      assignedRoles: {
        ...project.assignedRoles,
        pic:       form.assignedPIC   || project.assignedRoles?.pic   || "",
        qsManager: form.assignedQSMgr || project.assignedRoles?.qsManager || "",
      },
      updatedAt: new Date().toISOString(),
    };
    setSavedBanner(isFirstSubmit ? "submitted" : "saved");
    setSubmitted(true);
    onSubmitted(updated);
  }

  // PIC assigns SIC + Engineer
  function handlePicAssign() {
    if (!picPending.sic || !picPending.engineer) return;
    const updated = {
      ...project,
      stage: project.stage === "delegation" ? "engineer" : project.stage,
      assignedRoles: { ...project.assignedRoles, ...picPending },
      updatedAt: new Date().toISOString(),
    };
    setPicLocked(true); setPicEditing(false);
    setSavedBanner("assigned");
    onSubmitted(updated);
  }

  // QS Manager assigns QS TL
  function handleQSMAssign() {
    if (!qsmPending.qsTeamLeader) return;
    const updated = {
      ...project,
      assignedRoles: { ...project.assignedRoles, ...qsmPending },
      updatedAt: new Date().toISOString(),
    };
    setQsmLocked(true); setQsmEditing(false);
    setSavedBanner("assigned");
    onSubmitted(updated);
  }

  const cardStyle = {
    background:"#fff", border:`1px solid ${C.border}`, borderRadius:8,
    padding:24, marginBottom:16, overflow:"visible",
  };
  const labelStyle = {
    fontSize:12, fontWeight:500, color:C.textSec,
    display:"flex", alignItems:"center", gap:3, marginBottom:6,
  };
  const inputStyle = (editable=true) => ({
    height:36, border:`1px solid ${C.border}`, borderRadius:6,
    padding:"0 10px", fontSize:13,
    color: editable ? C.textPri : C.textSec,
    fontFamily:"inherit", background: editable ? "#fff" : "#f8fafc",
    width:"100%", cursor: editable ? "text" : "default", boxSizing:"border-box",
  });
  const selectStyle = {
    height:36, border:`1px solid ${C.border}`, borderRadius:6,
    padding:"0 10px", fontSize:13, color:C.textPri,
    fontFamily:"inherit", background:"#fff", width:"100%", cursor:"pointer",
  };
  function sectionTitle(icon, label) {
    return (
      <div style={{ fontSize:14, fontWeight:600, color:C.textPri, marginBottom:16,
        paddingBottom:10, borderBottom:`1px solid #f1f5f9`,
        display:"flex", alignItems:"center", gap:8 }}>
        <i className={`ti ${icon}`} style={{ color:C.navy, fontSize:15 }} aria-hidden="true" />
        {label}
      </div>
    );
  }

  // Delegation assignment row
  function AssignRow({ label, value, pool, onChange, locked }) {
    const u = getUser(value);
    return (
      <div style={{ display:"grid", gridTemplateColumns:"160px 1fr 100px", gap:12,
        alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f8fafc" }}>
        <div style={{ fontSize:13, fontWeight:500, color:C.textPri }}>
          <span style={{ color:C.danger, marginRight:2 }}>*</span>{label}
        </div>
        <div>
          {locked
            ? <div style={{ height:36, border:`1px solid ${C.border}`, borderRadius:6,
                padding:"0 10px", fontSize:13, color:C.textPri, background:"#f8fafc",
                display:"flex", alignItems:"center", fontWeight:500 }}>
                {u ? u.name : <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}
              </div>
            : <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
                <option value="">— Select —</option>
                {pool.map(u => <option key={u.uuid} value={u.uuid}>{u.name}</option>)}
              </select>
          }
        </div>
        <div style={{ textAlign:"center" }}>
          {value
            ? <span style={{ fontSize:11, fontWeight:500, padding:"2px 10px", borderRadius:10,
                background:"#dcfce7", color:"#15803d" }}>Assigned</span>
            : <span style={{ fontSize:11, color:C.textDis, fontStyle:"italic" }}>Pending</span>}
        </div>
      </div>
    );
  }

  const picUser = getUser(project.assignedRoles?.pic);
  const qsmUser = getUser(project.assignedRoles?.qsManager);

  // Delegation status rows for MO Secretary read-only view
  const delegationRows = [
    { label:"PIC",        role:"PIC",        uuid: project.assignedRoles?.pic,        assignedBy:"MO Secretary" },
    { label:"QS Manager", role:"QS Manager", uuid: project.assignedRoles?.qsManager,  assignedBy:"MO Secretary" },
    { label:"SIC",        role:"SIC",        uuid: project.assignedRoles?.sic,         assignedBy:"PIC" },
    { label:"Engineer",   role:"Engineer",   uuid: project.assignedRoles?.engineer,    assignedBy:"PIC" },
    { label:"QS Team Leader", role:"QS TL", uuid: project.assignedRoles?.qsTeamLeader,assignedBy:"QS Manager" },
  ];

  return (
    <>
    {showNewLocModal && (
      <NewLocationModal
        onClose={() => setShowNewLocModal(false)}
        onCreated={newLoc => {
          set("locationUUID", newLoc.uuid);
          setShowNewLocModal(false);
          setLocSearch("");
        }}
      />
    )}
    <div style={{ padding:24 }}>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSec, marginBottom:16 }}>
        <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>All Projects</a>
        <span style={{ color:C.textDis }}>›</span>
        <span>{project.siteCode || "New Project"}</span>
        <span style={{ color:C.textDis }}>›</span>
        <span>Section A — Project Overview</span>
      </div>

      {/* Success banners */}
      {savedBanner === "submitted" && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#dcfce7",
          border:"1px solid #86efac", borderRadius:6, padding:"10px 14px",
          fontSize:13, color:"#15803d", marginBottom:16 }}>
          <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
          Project submitted — PIC and QS Manager have been notified to assign their teams.
        </div>
      )}
      {savedBanner === "saved" && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#dcfce7",
          border:"1px solid #86efac", borderRadius:6, padding:"10px 14px",
          fontSize:13, color:"#15803d", marginBottom:16 }}>
          <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
          Changes saved successfully.
        </div>
      )}
      {savedBanner === "assigned" && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#dcfce7",
          border:"1px solid #86efac", borderRadius:6, padding:"10px 14px",
          fontSize:13, color:"#15803d", marginBottom:16 }}>
          <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
          {isPIC ? "Team assigned — Engineer has been notified to begin data entry." : "QS Team Leader assigned successfully."}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>

        {/* ── Left: form ── */}
        <div>
          {/* Read-only notice for PIC / QSM */}
          {(isPIC || isQSM) && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f8fafc",
              border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 12px",
              fontSize:12, color:C.textSec, marginBottom:16 }}>
              <i className="ti ti-lock" style={{ fontSize:14 }} aria-hidden="true" />
              Project identifiers are managed by MO Secretary — read-only for your role.
            </div>
          )}

          {/* ── Section A: Project Identifiers ── */}
          <div style={cardStyle}>
            {sectionTitle("ti-id", "Project Identifiers")}
            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Full Project Name</label>
              <input value={form.fullName} readOnly={!isMO}
                onChange={e => set("fullName", e.target.value)}
                placeholder="e.g. Wan Wan Terrace Residential Development"
                style={inputStyle(isMO)} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={labelStyle}><span style={{ color:C.danger }}>*</span> Site Code</label>
                <input value={form.siteCode} readOnly={!isMO}
                  onChange={e => set("siteCode", e.target.value)}
                  placeholder="e.g. 2026-RES-WWT" style={inputStyle(isMO)} />
              </div>
              <div>
                <label style={labelStyle}>Short Name</label>
                <input value={form.shortName} readOnly={!isMO}
                  onChange={e => set("shortName", e.target.value)}
                  placeholder="e.g. WWT" style={inputStyle(isMO)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Estate / Development Name</label>
              <input
                value={form.estateNameTBC ? "TBC" : form.estateName}
                readOnly={!isMO || form.estateNameTBC}
                onChange={e => set("estateName", e.target.value)}
                placeholder="Estate name"
                style={{
                  ...inputStyle(isMO && !form.estateNameTBC),
                  color: form.estateNameTBC ? C.textDis : (isMO ? C.textPri : C.textSec),
                  fontStyle: form.estateNameTBC ? "italic" : "normal",
                }} />
              {isMO && (
                <label style={{ display:"flex", alignItems:"center", gap:6, marginTop:6,
                  fontSize:12, color:C.textSec, cursor:"pointer" }}>
                  <input type="checkbox" checked={form.estateNameTBC}
                    onChange={e => { set("estateNameTBC", e.target.checked); if (e.target.checked) set("estateName", ""); }}
                    style={{ accentColor:C.navy }} />
                  Mark as TBC
                </label>
              )}
            </div>
          </div>

          {/* ── Location ── */}
          <div style={cardStyle}>
            {sectionTitle("ti-map-pin", "Location")}
            <div ref={locRef} style={{ position:"relative", overflow:"visible" }}>
              <label style={labelStyle}>Link to Location Registry</label>
              {isMO ? (
                <>
                  <div style={{ position:"relative" }}>
                    <i className="ti ti-search" style={{ position:"absolute", left:10,
                      top:"50%", transform:"translateY(-50%)", color:C.textDis, fontSize:14,
                      pointerEvents:"none" }} aria-hidden="true" />
                    <input
                      value={locSearch}
                      onChange={e => { setLocSearch(e.target.value); setLocDropOpen(true); }}
                      onFocus={() => setLocDropOpen(true)}
                      placeholder={activeLoc ? locPrimaryLabel(activeLoc) : "Search lot no., street, district…"}
                      style={{ ...inputStyle(true), paddingLeft:34 }} />
                  </div>
                  {locDropOpen && (
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:200,
                      background:"#fff", border:`1px solid ${C.border}`, borderRadius:8,
                      boxShadow:"0 8px 24px rgba(0,0,0,0.12)", marginTop:4, maxHeight:240, overflow:"auto" }}>
                      {locMatches.length === 0 && (
                        <div style={{ padding:"10px 12px", fontSize:13, color:C.textDis, fontStyle:"italic" }}>
                          No locations found
                        </div>
                      )}
                      {locMatches.map(l => (
                        <div key={l.uuid}
                          onClick={() => { set("locationUUID", l.uuid); setLocDropOpen(false); setLocSearch(""); }}
                          style={{ padding:"9px 12px", cursor:"pointer", borderBottom:"1px solid #f8fafc" }}
                          onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.background=""}>
                          <div style={{ fontSize:13, fontWeight:500, color:C.textPri }}>{locPrimaryLabel(l)}</div>
                          <div style={{ fontSize:11, color:C.textSec, marginTop:1 }}>
                            {l.streetNameNumber ? `${l.streetNameNumber}, ` : ""}{l.district}
                          </div>
                        </div>
                      ))}
                      <div onClick={() => { setLocDropOpen(false); setShowNewLocModal(true); }}
                        style={{ padding:"9px 12px", display:"flex", alignItems:"center", gap:6,
                          cursor:"pointer", background:"#f8fafc", borderTop:`1px solid ${C.border}`,
                          fontSize:13, color:C.midBlue, fontWeight:500 }}
                        onMouseEnter={e => e.currentTarget.style.background="#eff6ff"}
                        onMouseLeave={e => e.currentTarget.style.background="#f8fafc"}>
                        <i className="ti ti-plus" style={{ fontSize:14 }} aria-hidden="true" />
                        Create new location entry
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <input value={activeLoc ? locPrimaryLabel(activeLoc) : "No location linked"}
                  readOnly style={inputStyle(false)} />
              )}
              {/* Location detail */}
              {activeLoc && (
                <div style={{ marginTop:10, padding:"10px 12px", background:"#f8fafc",
                  border:`1px solid ${C.border}`, borderRadius:6 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                    {[
                      ["Lot Reference", locPrimaryLabel(activeLoc)],
                      ["Lot Type",      activeLoc.lotType||"—"],
                      ["Section",       activeLoc.section||"—"],
                      ["Street / No.",  activeLoc.streetNameNumber||"—"],
                      ["District",      activeLoc.district||"—"],
                      ["Remarks",       activeLoc.remarks||"—"],
                    ].map(([lbl, val]) => (
                      <div key={lbl}>
                        <label style={labelStyle}>{lbl}</label>
                        <input value={val} readOnly style={inputStyle(false)} />
                      </div>
                    ))}
                    {activeLoc.googleMapLink && (
                      <div style={{ gridColumn:"1/-1" }}>
                        <label style={labelStyle}>Google Map</label>
                        <a href={activeLoc.googleMapLink} target="_blank" rel="noreferrer"
                          style={{ fontSize:12, color:C.midBlue, wordBreak:"break-all" }}>
                          {activeLoc.googleMapLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Lease Plan ── */}
          <div style={cardStyle}>
            {sectionTitle("ti-paperclip", "Lease Plan")}
            <div onClick={() => isMO && alert("File upload simulated.")}
              style={{ border:`1px dashed #cbd5e1`, borderRadius:6, padding:"10px 14px",
                display:"flex", alignItems:"center", gap:10,
                cursor: isMO ? "pointer" : "default", background:"#fafbfc" }}>
              <i className="ti ti-file-upload" style={{ fontSize:20, color:C.textDis }} aria-hidden="true" />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:C.textSec }}>
                  {form.leasePlanURL ? "Lease plan uploaded" : isMO ? "Click to upload lease plan" : "No lease plan uploaded"}
                </div>
                <div style={{ fontSize:11, color:C.textDis, marginTop:2 }}>PDF or image, max 20 MB</div>
              </div>
              {isMO && (
                <button onClick={e => { e.stopPropagation(); alert("File upload simulated."); }}
                  style={{ fontSize:12, background:"#f1f5f9", border:`1px solid ${C.border}`,
                    borderRadius:5, padding:"5px 12px", cursor:"pointer",
                    color:C.textPri, fontFamily:"inherit" }}>
                  Browse
                </button>
              )}
            </div>
          </div>

          {/* ── MO Secretary initial assignments ── */}
          {isMO && (
            <div style={cardStyle}>
              {sectionTitle("ti-user-plus", "Initial Role Assignment")}
              <div style={{ fontSize:11, color:C.textDis, marginBottom:12 }}>
                Assign PIC and QS Manager. They will then assign their sub-teams during Delegation.
              </div>
              {[
                { label:"Project in Charge (PIC)", key:"assignedPIC",  pool:picUsers },
                { label:"QS Manager",              key:"assignedQSMgr",pool:qsmUsers },
              ].map(({ label, key, pool }) => {
                const u = getUser(form[key]);
                return (
                  <div key={key} style={{ display:"flex", alignItems:"center", gap:8,
                    padding:"8px 0", borderBottom:`1px solid #f8fafc` }}>
                    <div style={{ fontSize:12, color:C.textSec, width:200, flexShrink:0 }}>{label}</div>
                    <select value={form[key]} onChange={e => set(key, e.target.value)} style={selectStyle}>
                      <option value="">— Select —</option>
                      {pool.map(u => <option key={u.uuid} value={u.uuid}>{u.name}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── MO Secretary actions ── */}
          {isMO && (
            <div style={{ ...cardStyle, marginBottom:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {project.stage === "mo_secretary" ? (
                  <>
                    <button onClick={handleMOSubmit} style={{
                      display:"flex", alignItems:"center", gap:6,
                      background:C.navy, color:"#fff", border:"none", borderRadius:6,
                      padding:"0 20px", height:36, fontSize:13, fontWeight:500,
                      cursor:"pointer", fontFamily:"inherit" }}>
                      <i className="ti ti-send" style={{ fontSize:14 }} aria-hidden="true" />
                      Submit to Delegation
                    </button>
                    <button onClick={() => { setSavedBanner("saved"); }} style={{
                      background:"#fff", color:C.textPri, border:`1px solid ${C.border}`,
                      borderRadius:6, padding:"0 16px", height:36, fontSize:13,
                      cursor:"pointer", fontFamily:"inherit" }}>
                      Save Draft
                    </button>
                  </>
                ) : (
                  <button onClick={handleMOSubmit} style={{
                    display:"flex", alignItems:"center", gap:6,
                    background:C.navy, color:"#fff", border:"none", borderRadius:6,
                    padding:"0 20px", height:36, fontSize:13, fontWeight:500,
                    cursor:"pointer", fontFamily:"inherit" }}>
                    <i className="ti ti-device-floppy" style={{ fontSize:14 }} aria-hidden="true" />
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Delegation panel — all three roles see this ── */}
          {project.stage !== "mo_secretary" && (
            <div style={{ ...cardStyle, marginTop:16,
              border:`1px solid #bfdbfe`, background:"#f0f7ff" }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.navy, marginBottom:4,
                paddingBottom:10, borderBottom:"1px solid #dbeafe",
                display:"flex", alignItems:"center", gap:8 }}>
                <i className="ti ti-users" style={{ fontSize:15 }} aria-hidden="true" />
                Team Assignments
              </div>

              {/* MO Secretary — read-only summary */}
              {isMO && (
                <div style={{ paddingTop:10 }}>
                  <div style={{ fontSize:11, color:C.textSec, marginBottom:10 }}>
                    PIC assigns SIC and Engineer. QS Manager assigns QS Team Leader.
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"130px 1fr 1fr", gap:0 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textDis, textTransform:"uppercase",
                      letterSpacing:"0.05em", padding:"0 0 6px" }}>Role</div>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textDis, textTransform:"uppercase",
                      letterSpacing:"0.05em", padding:"0 0 6px" }}>Person</div>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textDis, textTransform:"uppercase",
                      letterSpacing:"0.05em", padding:"0 0 6px" }}>Assigned by</div>
                  </div>
                  {delegationRows.map(({ label, uuid, assignedBy }) => {
                    const u = getUser(uuid);
                    return (
                      <div key={label} style={{ display:"grid", gridTemplateColumns:"130px 1fr 1fr",
                        padding:"7px 0", borderTop:"1px solid #dbeafe", alignItems:"center" }}>
                        <div style={{ fontSize:12, fontWeight:600, color:"#1e40af" }}>{label}</div>
                        <div style={{ fontSize:13, color: u ? C.textPri : C.textDis,
                          fontStyle: u ? "normal" : "italic", fontWeight: u ? 500 : 400 }}>
                          {u ? u.name : "Not yet assigned"}
                        </div>
                        <div style={{ fontSize:11, color:C.textDis }}>{assignedBy}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PIC — assign SIC + Engineer */}
              {isPIC && !isMO && (
                <div style={{ paddingTop:10 }}>
                  <div style={{ fontSize:11, color:C.textSec, marginBottom:10 }}>
                    Assign SIC and Engineer for this project.
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"160px 1fr 100px",
                    padding:"0 0 8px", gap:12 }}>
                    {["Role","Assignee","Status"].map((h,i) => (
                      <div key={h} style={{ fontSize:10, fontWeight:700, color:C.textDis,
                        textTransform:"uppercase", letterSpacing:"0.05em",
                        textAlign: i===2 ? "center" : "left" }}>{h}</div>
                    ))}
                  </div>
                  <AssignRow label="Site in Charge (SIC)"
                    value={picLocked && !picEditing ? project.assignedRoles?.sic||"" : picPending.sic}
                    pool={sicUsers}
                    onChange={v => setPicPending(p => ({ ...p, sic:v }))}
                    locked={picLocked && !picEditing} />
                  <AssignRow label="Engineer"
                    value={picLocked && !picEditing ? project.assignedRoles?.engineer||"" : picPending.engineer}
                    pool={engineerUsers}
                    onChange={v => setPicPending(p => ({ ...p, engineer:v }))}
                    locked={picLocked && !picEditing} />
                  <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:10 }}>
                    {picLocked && !picEditing ? (
                      <>
                        <span style={{ fontSize:12, color:C.success, display:"flex", alignItems:"center", gap:4 }}>
                          <i className="ti ti-lock" style={{ fontSize:12 }} aria-hidden="true" /> Confirmed
                        </span>
                        <button onClick={() => { setPicEditing(true); setPicPending({ sic:project.assignedRoles?.sic||"", engineer:project.assignedRoles?.engineer||"" }); }}
                          style={{ fontSize:12, color:C.midBlue, background:"none", border:"none",
                            cursor:"pointer", fontFamily:"inherit", textDecoration:"underline" }}>
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={handlePicAssign}
                          disabled={!picPending.sic || !picPending.engineer}
                          style={{ background: (picPending.sic && picPending.engineer) ? C.navy : "#e2e8f0",
                            color: (picPending.sic && picPending.engineer) ? "#fff" : C.textDis,
                            border:"none", borderRadius:6, padding:"0 16px", height:34,
                            fontSize:13, fontWeight:500,
                            cursor: (picPending.sic && picPending.engineer) ? "pointer" : "not-allowed",
                            fontFamily:"inherit" }}>
                          Confirm Assignments
                        </button>
                        {picEditing && (
                          <button onClick={() => setPicEditing(false)}
                            style={{ fontSize:12, color:C.textSec, background:"none", border:"none",
                              cursor:"pointer", fontFamily:"inherit", textDecoration:"underline" }}>
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {/* Also show QSM assignment as read-only */}
                  <div style={{ marginTop:16, paddingTop:12, borderTop:"1px solid #dbeafe" }}>
                    <div style={{ fontSize:11, color:C.textSec, marginBottom:6 }}>QS Team Leader (assigned by QS Manager)</div>
                    <div style={{ fontSize:13, color: getUser(project.assignedRoles?.qsTeamLeader) ? C.textPri : C.textDis,
                      fontStyle: getUser(project.assignedRoles?.qsTeamLeader) ? "normal" : "italic" }}>
                      {getUser(project.assignedRoles?.qsTeamLeader)?.name || "Not yet assigned"}
                    </div>
                  </div>
                </div>
              )}

              {/* QS Manager — assign QS TL */}
              {isQSM && !isMO && (
                <div style={{ paddingTop:10 }}>
                  <div style={{ fontSize:11, color:C.textSec, marginBottom:10 }}>
                    Assign QS Team Leader for this project.
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"160px 1fr 100px",
                    padding:"0 0 8px", gap:12 }}>
                    {["Role","Assignee","Status"].map((h,i) => (
                      <div key={h} style={{ fontSize:10, fontWeight:700, color:C.textDis,
                        textTransform:"uppercase", letterSpacing:"0.05em",
                        textAlign: i===2 ? "center" : "left" }}>{h}</div>
                    ))}
                  </div>
                  <AssignRow label="QS Team Leader"
                    value={qsmLocked && !qsmEditing ? project.assignedRoles?.qsTeamLeader||"" : qsmPending.qsTeamLeader}
                    pool={qsTLUsers}
                    onChange={v => setQsmPending(p => ({ ...p, qsTeamLeader:v }))}
                    locked={qsmLocked && !qsmEditing} />
                  <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:10 }}>
                    {qsmLocked && !qsmEditing ? (
                      <>
                        <span style={{ fontSize:12, color:C.success, display:"flex", alignItems:"center", gap:4 }}>
                          <i className="ti ti-lock" style={{ fontSize:12 }} aria-hidden="true" /> Confirmed
                        </span>
                        <button onClick={() => { setQsmEditing(true); setQsmPending({ qsTeamLeader:project.assignedRoles?.qsTeamLeader||"" }); }}
                          style={{ fontSize:12, color:C.midBlue, background:"none", border:"none",
                            cursor:"pointer", fontFamily:"inherit", textDecoration:"underline" }}>
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleQSMAssign}
                          disabled={!qsmPending.qsTeamLeader}
                          style={{ background: qsmPending.qsTeamLeader ? C.navy : "#e2e8f0",
                            color: qsmPending.qsTeamLeader ? "#fff" : C.textDis,
                            border:"none", borderRadius:6, padding:"0 16px", height:34,
                            fontSize:13, fontWeight:500,
                            cursor: qsmPending.qsTeamLeader ? "pointer" : "not-allowed",
                            fontFamily:"inherit" }}>
                          Confirm Assignment
                        </button>
                        {qsmEditing && (
                          <button onClick={() => setQsmEditing(false)}
                            style={{ fontSize:12, color:C.textSec, background:"none", border:"none",
                              cursor:"pointer", fontFamily:"inherit", textDecoration:"underline" }}>
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {/* Also show PIC assignments as read-only */}
                  <div style={{ marginTop:16, paddingTop:12, borderTop:"1px solid #dbeafe" }}>
                    <div style={{ fontSize:11, color:C.textSec, marginBottom:6 }}>SIC &amp; Engineer (assigned by PIC)</div>
                    <div style={{ display:"flex", gap:16 }}>
                      {[
                        { label:"SIC", uuid:project.assignedRoles?.sic },
                        { label:"Engineer", uuid:project.assignedRoles?.engineer },
                      ].map(({ label, uuid }) => {
                        const u = getUser(uuid);
                        return (
                          <div key={label}>
                            <div style={{ fontSize:11, color:C.textDis, marginBottom:2 }}>{label}</div>
                            <div style={{ fontSize:13, color: u ? C.textPri : C.textDis,
                              fontStyle: u ? "normal" : "italic" }}>
                              {u ? u.name : "Not yet assigned"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: summary sidebar ── */}
        <div style={{ position:"sticky", top:16 }}>
          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textSec, textTransform:"uppercase",
              letterSpacing:"0.05em", marginBottom:12 }}>Project</div>
            {[
              { label:"Site Code",  value: form.siteCode  || "—", mono:true },
              { label:"Short Name", value: form.shortName || "—" },
              { label:"Location",   value: activeLoc ? locPrimaryLabel(activeLoc) : "—" },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ paddingBottom:6, marginBottom:6, borderBottom:"1px solid #f8fafc" }}>
                <div style={{ fontSize:11, color:C.textDis, fontWeight:500 }}>{label}</div>
                <div style={{ fontSize:13, color:C.textPri, fontWeight:500,
                  fontFamily: mono ? "'SF Mono',Consolas,monospace" : "inherit" }}>{value}</div>
              </div>
            ))}
            {/* Team — compact */}
            {project.stage !== "mo_secretary" && (
              <>
                {[
                  { label:"PIC",        uuid: project.assignedRoles?.pic },
                  { label:"QS Mgr / TL", value:
                      [getUser(project.assignedRoles?.qsManager)?.name,
                       getUser(project.assignedRoles?.qsTeamLeader)?.name]
                      .filter(Boolean).join(" / ") || "—" },
                  { label:"SIC",        uuid: project.assignedRoles?.sic },
                  { label:"Engineer",   uuid: project.assignedRoles?.engineer },
                ].map(({ label, uuid, value }) => {
                  const val = value ?? (getUser(uuid)?.name || "—");
                  return (
                    <div key={label} style={{ paddingBottom:5, marginBottom:5, borderBottom:"1px solid #f8fafc" }}>
                      <div style={{ fontSize:11, color:C.textDis, fontWeight:500 }}>{label}</div>
                      <div style={{ fontSize:12, color: val==="—" ? C.textDis : C.textPri, fontWeight:500 }}>{val}</div>
                    </div>
                  );
                })}
              </>
            )}
            <div style={{ marginBottom:8, marginTop:4 }}>
              <StatusBadge stage={project.stage} status={project.status} />
            </div>
            <Stepper currentStage={submitted ? "delegation" : project.stage} />
            {/* Manage team link — PIC and QSM only */}
            {(isPIC || isQSM) && project.stage !== "mo_secretary" && (
              <div style={{ marginTop:10, paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
                <button onClick={() => {}}
                  style={{ fontSize:11, color:C.midBlue, background:"none", border:"none",
                    cursor:"pointer", fontFamily:"inherit", padding:0, display:"flex",
                    alignItems:"center", gap:4 }}>
                  <i className="ti ti-pencil" style={{ fontSize:11 }} aria-hidden="true" />
                  Manage team assignments
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
function DelegationView({ currentUser, project, onBack, onUpdated }) {
  // isPIC: either this user IS the assigned PIC, or no PIC assigned yet and user has pic role
  const assignedPIC = project.assignedRoles?.pic;
  const isPIC = assignedPIC
    ? currentUser.uuid === assignedPIC
    : currentUser.role === "pic";

  const assignedQSM = project.assignedRoles?.qsManager;
  const isQSM = assignedQSM
    ? (currentUser.uuid === assignedQSM || currentUser.role === "qs_manager")
    : currentUser.role === "qs_manager";

  const engineerUsers = USERS.filter(u => u.role === "engineer");
  const sicUsers      = USERS.filter(u => u.role === "sic");
  const qsTLUsers     = USERS.filter(u => u.role === "qs_team_leader");

  // Separate pending/locked state for each block
  const [picPending, setPicPending] = useState({
    sic:      project.assignedRoles?.sic      || "",
    engineer: project.assignedRoles?.engineer || "",
  });
  const [qsmPending, setQsmPending] = useState({
    qsTeamLeader: project.assignedRoles?.qsTeamLeader || "",
  });

  // locked = confirmed by the responsible role
  const [picLocked, setPicLocked] = useState(
    !!(project.assignedRoles?.sic && project.assignedRoles?.engineer)
  );
  const [qsmLocked, setQsmLocked] = useState(
    !!project.assignedRoles?.qsTeamLeader
  );

  const [picEditing, setPicEditing] = useState(false);
  const [qsmEditing, setQsmEditing] = useState(false);

  // Current committed assignments (what's shown in summary)
  const [committed, setCommitted] = useState({
    sic:          project.assignedRoles?.sic          || "",
    engineer:     project.assignedRoles?.engineer     || "",
    qsTeamLeader: project.assignedRoles?.qsTeamLeader || "",
  });

  function handlePicAssign() {
    if (!picPending.sic || !picPending.engineer) return;
    const updated = {
      ...project,
      stage: "engineer",   // PIC assign is the critical path — unlocks engineer immediately
      assignedRoles: { ...project.assignedRoles, ...picPending },
      updatedAt: new Date().toISOString(),
    };
    setCommitted(c => ({ ...c, ...picPending }));
    setPicLocked(true);
    setPicEditing(false);
    onUpdated(updated);
  }

  function handleQsmAssign() {
    if (!qsmPending.qsTeamLeader) return;
    const updated = {
      ...project,
      assignedRoles: { ...project.assignedRoles, ...qsmPending },
      updatedAt: new Date().toISOString(),
    };
    setCommitted(c => ({ ...c, ...qsmPending }));
    setQsmLocked(true);
    setQsmEditing(false);
    onUpdated(updated);
  }

  const cardStyle = {
    background: "#fff", border: `1px solid ${C.border}`,
    borderRadius: 8, padding: 24, marginBottom: 16, overflow: "visible",
  };

  function SectionHeader({ name, role }) {
    return (
      <div style={{ fontSize: 15, fontWeight: 600, color: C.textPri, marginBottom: 14,
        paddingBottom: 10, borderBottom: `1px solid #f1f5f9`,
        display: "flex", alignItems: "center", gap: 8 }}>
        <i className="ti ti-user-check" style={{ color: C.navy, fontSize: 16 }} aria-hidden="true" />
        Assigned by {role} — {name}
      </div>
    );
  }

  function ColHeaders() {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 110px", gap: 12,
        padding: "4px 0 8px", borderBottom: `1px solid ${C.border}`, marginBottom: 2 }}>
        {["Role", "Assignee", "Status"].map((h, i) => (
          <div key={h} style={{ fontSize: 11, fontWeight: 600, color: C.textSec,
            textTransform: "uppercase", letterSpacing: "0.04em",
            textAlign: i === 2 ? "center" : "left" }}>{h}</div>
        ))}
      </div>
    );
  }

  function AssignRow({ label, value, pool, onChange, locked }) {
    const assigned = getUser(value);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 110px", gap: 12,
        alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.textPri }}>
          <span style={{ color: C.danger, marginRight: 2 }}>*</span>{label}
        </div>
        <div>
          {locked ? (
            <div style={{ height: 36, border: `1px solid ${C.border}`, borderRadius: 6,
              padding: "0 10px", fontSize: 13, color: C.textPri, background: "#f8fafc",
              display: "flex", alignItems: "center", fontWeight: 500 }}>
              {assigned ? assigned.name : <span style={{ color: C.textDis, fontStyle: "italic" }}>—</span>}
            </div>
          ) : (
            <select value={value} onChange={e => onChange(e.target.value)}
              style={{ height: 36, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: "0 10px", fontSize: 13, color: C.textPri,
                fontFamily: "inherit", background: "#fff", width: "100%", cursor: "pointer" }}>
              <option value="">— Select —</option>
              {pool.map(u => <option key={u.uuid} value={u.uuid}>{u.name}</option>)}
            </select>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {value ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 10,
              background: "#dcfce7", color: "#15803d" }}>
              <i className="ti ti-check" style={{ fontSize: 11 }} aria-hidden="true" /> Assigned
            </span>
          ) : (
            <span style={{ fontSize: 11, color: C.textDis, fontStyle: "italic" }}>Pending</span>
          )}
        </div>
      </div>
    );
  }

  const picUser = getUser(project.assignedRoles?.pic);
  const qsmUser = getUser(project.assignedRoles?.qsManager);
  const picReady = picPending.sic && picPending.engineer;
  const qsmReady = !!qsmPending.qsTeamLeader;

  // Effective stage for stepper — advance once PIC assigns
  const effectiveStage = picLocked ? "engineer" : project.stage;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12,
        color: C.textSec, marginBottom: 16 }}>
        <a onClick={onBack} style={{ color: C.midBlue, cursor: "pointer" }}>All Projects</a>
        <span style={{ color: C.textDis }}>›</span>
        <span>{project.siteCode}</span>
        <span style={{ color: C.textDis }}>›</span>
        <span>Delegation</span>
      </div>

      {picLocked && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#dcfce7",
          border: "1px solid #86efac", borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: "#15803d", marginBottom: 16 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 16 }} aria-hidden="true" />
          Engineer assigned — {getUser(committed.engineer)?.name} can now begin data entry.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20, alignItems: "start" }}>
        <div>

          {/* ── PIC block ── */}
          <div style={cardStyle}>
            <SectionHeader name={picUser?.name || "—"} role="PIC" />
            <ColHeaders />
            <AssignRow
              label="Site in Charge (SIC)"
              value={picLocked && !picEditing ? committed.sic : picPending.sic}
              pool={sicUsers}
              onChange={v => setPicPending(p => ({ ...p, sic: v }))}
              locked={picLocked && !picEditing}
            />
            <AssignRow
              label="Engineer"
              value={picLocked && !picEditing ? committed.engineer : picPending.engineer}
              pool={engineerUsers}
              onChange={v => setPicPending(p => ({ ...p, engineer: v }))}
              locked={picLocked && !picEditing}
            />
            {isPIC && (
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
                {picLocked && !picEditing ? (
                  <>
                    <span style={{ fontSize: 12, color: C.success, display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-lock" style={{ fontSize: 13 }} aria-hidden="true" /> Assignments confirmed
                    </span>
                    <button onClick={() => { setPicEditing(true); setPicPending({ sic: committed.sic, engineer: committed.engineer }); }}
                      style={{ fontSize: 12, color: C.midBlue, background: "none", border: "none",
                        cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handlePicAssign} disabled={!picReady}
                      style={{ background: picReady ? C.navy : "#e2e8f0",
                        color: picReady ? "#fff" : C.textDis, border: "none", borderRadius: 6,
                        padding: "0 16px", height: 34, fontSize: 13, fontWeight: 500,
                        cursor: picReady ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                      Assign
                    </button>
                    {picEditing && (
                      <button onClick={() => { setPicEditing(false); }}
                        style={{ fontSize: 12, color: C.textSec, background: "none", border: "none",
                          cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                        Cancel
                      </button>
                    )}
                    {!picReady && <span style={{ fontSize: 12, color: C.textDis }}>Both fields required.</span>}
                  </>
                )}
              </div>
            )}
            {!isPIC && (
              <div style={{ marginTop: 10, fontSize: 12, color: C.textDis, fontStyle: "italic" }}>
                {picLocked ? "Confirmed by PIC." : "Awaiting PIC to assign."}
              </div>
            )}
          </div>

          {/* ── QS Manager block ── */}
          <div style={cardStyle}>
            <SectionHeader name={qsmUser?.name || "—"} role="QS Manager" />
            <ColHeaders />
            <AssignRow
              label="QS Team Leader"
              value={qsmLocked && !qsmEditing ? committed.qsTeamLeader : qsmPending.qsTeamLeader}
              pool={qsTLUsers}
              onChange={v => setQsmPending(p => ({ ...p, qsTeamLeader: v }))}
              locked={qsmLocked && !qsmEditing}
            />
            {isQSM && (
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
                {qsmLocked && !qsmEditing ? (
                  <>
                    <span style={{ fontSize: 12, color: C.success, display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="ti ti-lock" style={{ fontSize: 13 }} aria-hidden="true" /> Assignment confirmed
                    </span>
                    <button onClick={() => { setQsmEditing(true); setQsmPending({ qsTeamLeader: committed.qsTeamLeader }); }}
                      style={{ fontSize: 12, color: C.midBlue, background: "none", border: "none",
                        cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleQsmAssign} disabled={!qsmReady}
                      style={{ background: qsmReady ? C.navy : "#e2e8f0",
                        color: qsmReady ? "#fff" : C.textDis, border: "none", borderRadius: 6,
                        padding: "0 16px", height: 34, fontSize: 13, fontWeight: 500,
                        cursor: qsmReady ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                      Assign
                    </button>
                    {qsmEditing && (
                      <button onClick={() => setQsmEditing(false)}
                        style={{ fontSize: 12, color: C.textSec, background: "none", border: "none",
                          cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                        Cancel
                      </button>
                    )}
                    {!qsmReady && <span style={{ fontSize: 12, color: C.textDis }}>Field required.</span>}
                  </>
                )}
              </div>
            )}
            {!isQSM && (
              <div style={{ marginTop: 10, fontSize: 12, color: C.textDis, fontStyle: "italic" }}>
                {qsmLocked ? "Confirmed by QS Manager." : "Awaiting QS Manager to assign."}
              </div>
            )}
          </div>

          {/* ── Delegation Summary ── */}
          <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.textPri, marginBottom: 14,
              paddingBottom: 10, borderBottom: `1px solid #f1f5f9`,
              display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-list-check" style={{ color: C.navy, fontSize: 16 }} aria-hidden="true" />
              Delegation Summary
            </div>
            {[
              { label: "Site in Charge (SIC)",  uuid: committed.sic,          note: "Assigned by PIC" },
              { label: "Engineer",               uuid: committed.engineer,     note: "Assigned by PIC — critical path" },
              { label: "QS Team Leader",         uuid: committed.qsTeamLeader, note: "Assigned by QS Manager" },
            ].map(({ label, uuid, note }) => {
              const u = getUser(uuid);
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0", borderBottom: "1px solid #f8fafc", fontSize: 13 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: u ? "#dcfce7" : "#f1f5f9",
                    border: `1px solid ${u ? "#86efac" : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {u && <i className="ti ti-check" style={{ fontSize: 11, color: "#15803d" }} aria-hidden="true" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: C.textPri, fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 11, color: C.textSec, marginLeft: 8 }}>{note}</span>
                  </div>
                  <div style={{ fontSize: 13, color: u ? C.textPri : C.textDis, fontStyle: u ? "normal" : "italic" }}>
                    {u ? u.name : "Pending"}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right sidebar */}
        <div style={{ position: "sticky", top: 0 }}>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textSec, textTransform: "uppercase",
              letterSpacing: "0.04em", marginBottom: 12 }}>Project Summary</div>
            {[
              { label: "Site Code",  value: project.siteCode,  mono: true },
              { label: "Short Name", value: project.shortName },
              { label: "Full Name",  value: project.fullName },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ paddingBottom: 6, marginBottom: 6, borderBottom: "1px solid #f8fafc" }}>
                <div style={{ fontSize: 11, color: C.textDis, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 13, color: C.textPri, fontWeight: 500,
                  fontFamily: mono ? "monospace" : "inherit" }}>{value || "—"}</div>
              </div>
            ))}
            <div style={{ paddingBottom: 6, marginBottom: 6, borderBottom: "1px solid #f8fafc" }}>
              <div style={{ fontSize: 11, color: C.textDis, fontWeight: 500, marginBottom: 4 }}>Stage</div>
              <StatusBadge stage={effectiveStage} status={project.status} />
              <span style={{ marginLeft: 6, fontSize: 12, color: C.textPri, fontWeight: 500 }}>
                {STAGE_LABEL[effectiveStage]}
              </span>
            </div>
            <Stepper currentStage={effectiveStage} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 4: Engineer + QS Team Leader Entry ────────────────────────────

// SM ↔ SF auto-conversion
function smToSf(sm) {
  const v = parseFloat(sm);
  return isNaN(v) ? "" : Math.round(v * 10.7639).toString();
}
function sfToSm(sf) {
  const v = parseFloat(sf);
  return isNaN(v) ? "" : Math.round(v / 10.7639).toString();
}

// Working Note button + inline teal note
function WorkingNoteWidget({ fieldKey, notes, onAdd, onRemove, canSee }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  if (!canSee) return null;
  // addNote stores: { id, fieldKey, text, author (name string), at (ISO string) }
  const existing = notes.filter(n => n.fieldKey === fieldKey);
  return (
    <div style={{ marginTop: 4 }}>
      {existing.map(n => (
        <div key={n.id} style={{ background: "#f0fdfa", border: "1px solid #0d9488", borderRadius: 5,
          padding: "6px 10px", fontSize: 11, color: "#0f766e", marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <i className="ti ti-notes" style={{ fontSize: 13, marginTop: 1, flexShrink: 0 }} aria-hidden="true" />
            <span style={{ flex: 1 }}>{n.text}</span>
            <button onClick={() => onRemove(n.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
          </div>
          <div style={{ marginTop: 4, marginLeft: 21, fontSize: 10, color: "#94a3b8" }}>
            {n.author} · {n.at ? new Date(n.at).toLocaleString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" }) : ""}
          </div>
        </div>
      ))}
      {!open ? (
        <button onClick={() => setOpen(true)}
          style={{ fontSize: 11, color: "#0d9488", background: "none", border: "none",
            cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 3 }}>
          <i className="ti ti-plus" style={{ fontSize: 11 }} aria-hidden="true" />
          Add note
        </button>
      ) : (
        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
          <input value={draft} onChange={e => setDraft(e.target.value)}
            placeholder="Working note (visible to Engineer & QS TL only)…"
            style={{ flex: 1, height: 30, border: "1px solid #0d9488", borderRadius: 5,
              padding: "0 8px", fontSize: 12, fontFamily: "inherit", color: "#0f172a" }} />
          <button onClick={() => { if (draft.trim()) { onAdd(fieldKey, draft.trim()); setDraft(""); setOpen(false); } }}
            style={{ background: "#0d9488", color: "#fff", border: "none", borderRadius: 5,
              padding: "0 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
          <button onClick={() => { setDraft(""); setOpen(false); }}
            style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 5,
              padding: "0 8px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#64748b" }}>×</button>
        </div>
      )}
    </div>
  );
}

// ─── Contractor mock data ─────────────────────────────────────────────────
const CONTRACTORS = [
  { name:"Gammon Construction Ltd",           licences:["HKBR-2023-07821","HKBR-2021-04412"] },
  { name:"Hip Hing Construction Co. Ltd",     licences:["HKBR-2021-05521","HKBR-2020-03318"] },
  { name:"Paul Y. Construction Group",        licences:["HKBR-2024-04412","HKBR-2022-09103"] },
  { name:"Leighton Contractors (Asia) Ltd",   licences:["HKBR-2022-08831","HKBR-2023-11204"] },
  { name:"China State Construction Eng. HK",  licences:["HKBR-2023-06612","HKBR-2021-07734"] },
  { name:"Hsin Chong Construction Co. Ltd",   licences:["HKBR-2022-05509","HKBR-2020-02217"] },
  { name:"Penta-Ocean Construction Co. Ltd",  licences:["HKBR-2024-01123","HKBR-2022-08840"] },
  { name:"Zen Pacific Construction Ltd",      licences:["HKBR-2023-09934","HKBR-2021-06621"] },
  { name:"Sanfield (Management) Ltd",         licences:["HKBR-2022-07718","HKBR-2020-04405"] },
  { name:"Dragages Hong Kong Ltd",            licences:["HKBR-2024-03301","HKBR-2022-10012"] },
];

const CONTRACTS_MANAGERS = [
  "Alice Leung", "Thomas Chan", "Winnie Ho", "Raymond Ng", "Stephanie Lam",
];

// ─── Shared: Project Identifiers block (consistent across all screens) ────

function ProjectIdentifiersBlock({ project }) {
  const loc = getLoc(project.locationUUID);
  const roSt = {
    height:34, border:`1px solid ${C.border}`, borderRadius:6,
    padding:"0 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
    display:"flex", alignItems:"center",
  };
  return (
    <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8,
      marginBottom:16, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 20px",
        borderBottom:`1px solid ${C.border}`, background:"#f8fafc" }}>
        <i className="ti ti-id" style={{ fontSize:15, color:C.navy }} aria-hidden="true" />
        <span style={{ fontSize:13, fontWeight:600, color:C.textPri }}>Project Identifiers & Location</span>
        <span style={{ marginLeft:"auto", fontSize:11, color:C.textDis }}>Read-only · managed by MO Secretary</span>
      </div>
      <div style={{ padding:"14px 20px" }}>
        {/* Row 1: Site Code + Short Name */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:10 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>Site Code</div>
            <div style={{ ...roSt, fontFamily:"'SF Mono',Consolas,monospace", fontWeight:600 }}>
              {project.siteCode || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>Short Name</div>
            <div style={roSt}>{project.shortName || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}</div>
          </div>
        </div>
        {/* Row 2: Full Name — full width */}
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>Full Name of Project</div>
          <div style={{ ...roSt, height:"auto", minHeight:34, padding:"8px 10px", lineHeight:1.4 }}>
            {project.fullName || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}
          </div>
        </div>
        {/* Row 3: Estate Name — full width */}
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>Estate / Development Name</div>
          <div style={roSt}>
            {project.estateNameTBC
              ? <span style={{ color:C.warning, fontStyle:"italic" }}>TBC</span>
              : project.estateName || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}
          </div>
        </div>
        {/* Row 4: Lot Ref + Street + District */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>Lot Reference</div>
            <div style={{ ...roSt, fontFamily:"'SF Mono',Consolas,monospace", fontSize:12 }}>
              {loc ? locPrimaryLabel(loc) : <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>Street</div>
            <div style={roSt}>{loc?.streetNameNumber || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}</div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>District</div>
            <div style={roSt}>{loc?.district || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Engineer Entry sub-components (defined OUTSIDE to prevent focus loss) ─

function EE_SecHeader({ sKey, icon, title, filled, total, secOpen, toggleSec }) {
  const done = total > 0 && filled >= total;
  return (
    <button onClick={() => toggleSec(sKey)} style={{
      width:"100%", display:"flex", alignItems:"center", gap:10,
      background: secOpen[sKey] ? "#f8fafc" : "#fff",
      border:"none", borderBottom: secOpen[sKey] ? `1px solid ${C.border}` : "none",
      padding:"14px 20px", cursor:"pointer", fontFamily:"inherit",
    }}>
      <i className={`ti ${icon}`} style={{ fontSize:15, color:C.navy, flexShrink:0 }} aria-hidden="true" />
      <span style={{ fontSize:14, fontWeight:600, color:C.textPri, flex:1, textAlign:"left" }}>{title}</span>
      {total > 0 && (
        <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:8,
          background: done ? "#dcfce7" : "#f1f5f9",
          color: done ? "#15803d" : C.textSec,
          display:"flex", alignItems:"center", gap:4 }}>
          {done && <i className="ti ti-check" style={{ fontSize:10 }} aria-hidden="true" />}
          {filled}/{total} required
        </span>
      )}
      <i className={`ti ${secOpen[sKey] ? "ti-chevron-up" : "ti-chevron-down"}`}
        style={{ fontSize:13, color:C.textDis, flexShrink:0 }} aria-hidden="true" />
    </button>
  );
}

// Numeric area row — formats to 2dp on blur, rejects non-numeric input
function EE_AreaRow({ label, smKey, sfKey, req, B, setB1, canEdit, workingNotes, addNote, removeNote, canSeeNotes }) {
  const inp = (active) => ({
    height:36, border:`1px solid ${C.border}`, borderRadius:6,
    padding:"0 10px", fontSize:13, color: active ? C.textPri : C.textSec,
    fontFamily:"inherit", background: active ? "#fff" : "#f8fafc",
    width:"100%", cursor: active ? "text" : "default", boxSizing:"border-box",
  });
  function smToSf(v) { const n = parseFloat(v); return isNaN(n) ? "" : (n * 10.7639).toFixed(2); }
  function sfToSm(v) { const n = parseFloat(v); return isNaN(n) ? "" : (n / 10.7639).toFixed(2); }
  function numericOnly(v) { return v.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); }
  function fmt2dp(v) { const n = parseFloat(v); return isNaN(n) ? "" : n.toFixed(2); }

  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:500, color:C.textSec, marginBottom:6, display:"block" }}>
        {req && <span style={{ color:C.danger, marginRight:2 }}>*</span>}{label}
        <span style={{ fontSize:10, color:C.textDis, marginLeft:6 }}>m² / ft² (auto-converted)</span>
      </label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 40px 1fr", gap:6, alignItems:"center" }}>
        <input
          value={B[smKey]} readOnly={!canEdit}
          onChange={e => { const v = numericOnly(e.target.value); setB1(smKey, v); setB1(sfKey, smToSf(v)); }}
          onBlur={e => { const v = fmt2dp(e.target.value); setB1(smKey, v); setB1(sfKey, smToSf(v)); }}
          placeholder="m²" style={inp(canEdit)} />
        <div style={{ textAlign:"center", fontSize:11, color:C.textDis }}>↔</div>
        <input
          value={B[sfKey]} readOnly={!canEdit}
          onChange={e => { const v = numericOnly(e.target.value); setB1(sfKey, v); setB1(smKey, sfToSm(v)); }}
          onBlur={e => { const v = fmt2dp(e.target.value); setB1(sfKey, v); setB1(smKey, sfToSm(v)); }}
          placeholder="ft²" style={inp(canEdit)} />
      </div>
      <WorkingNoteWidget fieldKey={smKey} notes={workingNotes} onAdd={addNote} onRemove={removeNote} canSee={canSeeNotes} />
    </div>
  );
}

function EE_DateRow({ label, dateKey, req, B, setDate, canEdit, workingNotes, addNote, removeNote, canSeeNotes }) {
  const inp = (active) => ({
    height:36, border:`1px solid ${C.border}`, borderRadius:6, padding:"0 10px",
    fontSize:12, color: active ? C.textPri : C.textSec,
    fontFamily:"inherit", background: active ? "#fff" : "#f8fafc",
    width:"100%", cursor: active ? "text" : "default", boxSizing:"border-box",
  });
  return (
    <div style={{ padding:"6px 0", borderBottom:"1px solid #f8fafc" }}>
      <div style={{ display:"grid", gridTemplateColumns:"170px 1fr 1fr", gap:8, alignItems:"center" }}>
        <div style={{ fontSize:12, fontWeight:500, color:C.textSec }}>
          {req && <span style={{ color:C.danger, marginRight:2 }}>*</span>}{label}
        </div>
        <input type="date" value={B.dates[dateKey].target} readOnly={!canEdit}
          onChange={e => setDate(dateKey,"target",e.target.value)}
          style={inp(canEdit)} />
        <input type="date" value={B.dates[dateKey].actual} readOnly={!canEdit}
          onChange={e => setDate(dateKey,"actual",e.target.value)}
          style={inp(canEdit)} />
      </div>
      <WorkingNoteWidget fieldKey={"dates."+dateKey} notes={workingNotes} onAdd={addNote} onRemove={removeNote} canSee={canSeeNotes} />
    </div>
  );
}

function EE_BDRow({ label, objKey, req, B, setBNested, canEdit, workingNotes, addNote, removeNote, canSeeNotes }) {
  const inp = (active) => ({
    height:36, border:`1px solid ${C.border}`, borderRadius:6, padding:"0 10px",
    fontSize:13, color: active ? C.textPri : C.textSec,
    fontFamily:"inherit", background: active ? "#fff" : "#f8fafc",
    width:"100%", cursor: active ? "text" : "default", boxSizing:"border-box",
  });
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:500, color:C.textSec, marginBottom:6, display:"block" }}>
        {req && <span style={{ color:C.danger, marginRight:2 }}>*</span>}{label}
      </label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 110px", gap:6 }}>
        <input value={B[objKey].name} readOnly={!canEdit}
          onChange={e => setBNested(objKey,"name",e.target.value)}
          placeholder="Name" style={inp(canEdit)} />
        <input value={B[objKey].bdCode} readOnly
          style={{ ...inp(false), fontFamily:"monospace", fontSize:11, textAlign:"center" }} />
      </div>
      <WorkingNoteWidget fieldKey={objKey} notes={workingNotes} onAdd={addNote} onRemove={removeNote} canSee={canSeeNotes} />
    </div>
  );
}

function EE_Field({ label, req, value, onChange, readOnly, placeholder, workingNotes, addNote, removeNote, canSeeNotes, noteKey }) {
  const inp = (active) => ({
    height:36, border:`1px solid ${C.border}`, borderRadius:6, padding:"0 10px",
    fontSize:13, color: active ? C.textPri : C.textSec,
    fontFamily:"inherit", background: active ? "#fff" : "#f8fafc",
    width:"100%", cursor: active ? "text" : "default", boxSizing:"border-box",
  });
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:500, color:C.textSec, marginBottom:6, display:"block" }}>
        {req && <span style={{ color:C.danger, marginRight:2 }}>*</span>}{label}
      </label>
      <input value={value} readOnly={readOnly} onChange={onChange}
        placeholder={placeholder} style={inp(!readOnly)} />
      <WorkingNoteWidget fieldKey={noteKey || label} notes={workingNotes} onAdd={addNote} onRemove={removeNote} canSee={canSeeNotes} />
    </div>
  );
}

function EE_QSTLClar({ fieldPath, fieldLabel: fLabel, qstlClarifications, setQstlClarifications, isQSTL, qstlReviewMode, currentUser }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const existing = qstlClarifications.filter(c => c.fieldPath === fieldPath);
  return (
    <div style={{ marginTop:3 }}>
      {existing.map(cr => (
        <div key={cr.id} style={{ background:"#fffbeb", border:"1px solid #d97706",
          borderRadius:5, padding:"7px 10px", marginTop:4, fontSize:12 }}>
          <span style={{ fontWeight:600, color:"#92400e" }}>{getUser(cr.askedBy)?.name}: </span>
          {cr.question}
        </div>
      ))}
      {isQSTL && qstlReviewMode && !existing.some(c=>c.status==="open") && (
        !open ? (
          <button onClick={() => setOpen(true)}
            style={{ fontSize:11, color:"#d97706", background:"none", border:"none",
              cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:3, marginTop:2 }}>
            <i className="ti ti-message-question" style={{ fontSize:11 }} aria-hidden="true" />
            Request clarification
          </button>
        ) : (
          <div style={{ marginTop:4, display:"flex", gap:6 }}>
            <input value={question} onChange={e => setQuestion(e.target.value)}
              placeholder="Your question…" autoFocus
              style={{ flex:1, height:28, border:`1px solid ${C.border}`, borderRadius:5,
                padding:"0 8px", fontSize:11, fontFamily:"inherit" }} />
            <button onClick={() => {
              if (!question.trim()) return;
              setQstlClarifications(prev => [...prev, {
                id:Date.now(), fieldPath, fieldLabel:fLabel,
                askedBy:currentUser.uuid, askedAt:new Date().toISOString(),
                question:question.trim(), status:"open", reply:"",
              }]);
              setQuestion(""); setOpen(false);
            }} style={{ fontSize:11, background:C.navy, color:"#fff", border:"none",
              borderRadius:5, padding:"0 10px", cursor:"pointer", fontFamily:"inherit" }}>Send</button>
            <button onClick={() => setOpen(false)}
              style={{ fontSize:11, background:"none", border:`1px solid ${C.border}`,
                borderRadius:5, padding:"0 8px", cursor:"pointer", fontFamily:"inherit" }}>✕</button>
          </div>
        )
      )}
    </div>
  );
}

function EE_QSTLReturnPanel({ project, currentUser, onUpdated }) {
  const [show, setShow] = useState(false);
  const [note, setNote] = useState("");
  return !show ? (
    <button onClick={() => setShow(true)}
      style={{ fontSize:12, color:C.textSec, background:"none", border:"none",
        cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4,
        textDecoration:"underline", paddingLeft:0 }}>
      <i className="ti ti-arrow-back-up" style={{ fontSize:13 }} aria-hidden="true" />
      Return for revision…
    </button>
  ) : (
    <div style={{ background:"#fff8f8", border:"1px solid #fca5a5", borderRadius:6,
      padding:"12px 14px", marginTop:4 }}>
      <div style={{ fontSize:13, fontWeight:600, color:"#991b1b", marginBottom:8 }}>⚠ Return to Engineer</div>
      <textarea value={note} onChange={e => setNote(e.target.value)}
        placeholder="Note for Engineer (optional)…" rows={2}
        style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:6,
          padding:"6px 10px", fontSize:12, fontFamily:"inherit", resize:"none",
          boxSizing:"border-box", marginBottom:10 }} />
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => {
          const updated = { ...project, stage:"engineer",
            approvalHistory:[...(project.approvalHistory||[]),{
              stage:"qs_team_leader", action:"returned", userUUID:currentUser.uuid,
              timestamp:new Date().toISOString(), returnedToStage:"engineer", note,
            }], updatedAt:new Date().toISOString() };
          onUpdated(updated);
        }} style={{ background:C.danger, color:"#fff", border:"none", borderRadius:6,
          padding:"0 14px", height:32, fontSize:13, fontWeight:500,
          cursor:"pointer", fontFamily:"inherit" }}>Confirm Return</button>
        <button onClick={() => setShow(false)}
          style={{ background:"#fff", color:C.textPri, border:`1px solid ${C.border}`,
            borderRadius:6, padding:"0 12px", height:32, fontSize:13,
            cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Screen 4: Engineer + QS TL Entry ─────────────────────────────────────

function EngineerQSEntry({ currentUser, project, onBack, onUpdated, onInitiateRevision, onEditAssignments }) {
  const isEngineer   = currentUser.uuid === project.assignedRoles?.engineer || currentUser.role === "engineer";
  const isQSTL       = currentUser.uuid === project.assignedRoles?.qsTeamLeader || currentUser.role === "qs_team_leader";
  const canEdit      = isEngineer;
  const canSeeNotes  = isEngineer || isQSTL;

  const [secOpen, setSecOpen] = useState({ areas:true, building:true, dates:true, team:true, contractor:true, contract:true });
  function toggleSec(key) { setSecOpen(s => ({ ...s, [key]: !s[key] })); }

  const sb = project.sectionB || {};
  const [B, setB] = useState({
    siteAreaSM: sb.siteAreaSM || "", siteAreaSF: sb.siteAreaSF || "",
    gfaSM: sb.gfaSM || "", gfaSF: sb.gfaSF || "",
    domesticGfaSM: sb.domesticGfaSM || "", domesticGfaSF: sb.domesticGfaSF || "",
    nonDomesticGfaSM: sb.nonDomesticGfaSM || "", nonDomesticGfaSF: sb.nonDomesticGfaSF || "",
    constructionFloorAreaSM: sb.constructionFloorAreaSM || "", constructionFloorAreaSF: sb.constructionFloorAreaSF || "",
    natureOfProject: sb.natureOfProject || [],
    noOfBlocksStorey: sb.noOfBlocksStorey || "",
    residentialUnits: { ...{ tower:"", villa:"", house:"" }, ...(sb.residentialUnits||{}) },
    carpark: { ...{ residential:"", commercial:"", visitor:"", motorcycle:"", bicycle:"", loadingUnloading:"", publicVehicle:"", lgvHgvCoach:"" }, ...(sb.carpark||{}) },
    beamPlus: { ...{ target:"", actual:"" }, ...(sb.beamPlus||{}) },
    dates: {
      commencement:              { target:"", actual:"", ...(sb.dates?.commencement||{}) },
      siteFormationCommencement: { target:"", actual:"", ...(sb.dates?.siteFormationCommencement||{}) },
      capCommencement:           { target:"", actual:"", ...(sb.dates?.capCommencement||{}) },
      occupationPermit:          { target:"", actual:"", ...(sb.dates?.occupationPermit||{}) },
      phasedOccupationPermit:    { target:"", actual:"", ...(sb.dates?.phasedOccupationPermit||{}) },
      practicalCompletion:       { target:"", actual:"", ...(sb.dates?.practicalCompletion||{}) },
      sectionalCompletion:       { target:"", actual:"", ...(sb.dates?.sectionalCompletion||{}) },
      consentToAssign:           { target:"", actual:"", ...(sb.dates?.consentToAssign||{}) },
      certificateOfCompliance:   { target:"", actual:"", ...(sb.dates?.certificateOfCompliance||{}) },
      buildingCovenant:          { target:"", actual:"", ...(sb.dates?.buildingCovenant||{}) },
    },
    defectLiabilityPeriod: sb.defectLiabilityPeriod || "",
    projectPhasing: sb.projectPhasing || "",
    developer: sb.developer || "",
    cpm: { ...{ title:"", name:"", email:"" }, ...(sb.cpm||{}) },
    technicalDirector:   { ...{ name:"", bdCode:"BDTD" }, ...(sb.technicalDirector||{}) },
    authorisedSignatory: { ...{ name:"", bdCode:"BDAS" }, ...(sb.authorisedSignatory||{}) },
    designArchitect: sb.designArchitect || "",
    architectureAP:  { ...{ name:"", bdCode:"BDAP"  }, ...(sb.architectureAP||{}) },
    rse:             { ...{ name:"", bdCode:"BDRSE" }, ...(sb.rse||{}) },
    rge:             { ...{ name:"", bdCode:"BDRGE" }, ...(sb.rge||{}) },
    meConsultant: sb.meConsultant || "",
    landscapeConsultant: sb.landscapeConsultant || "",
    interiorDesigner: sb.interiorDesigner || "",
    sustainabilityConsultant: sb.sustainabilityConsultant || "",
    qsConsultant: sb.qsConsultant || "",
    otherConsultants: sb.otherConsultants || [{ title:"", name:"" }],
    estateManagement: sb.estateManagement || "",
    mainContractor: sb.mainContractor || "",
    contractorLicences: sb.contractorLicences || (sb.contractorLicence ? [sb.contractorLicence] : []),
    costControlLeaders: {
      accountingManager: "Kevin Tsang",
      qsManager: getUser(project.assignedRoles?.qsManager)?.name || sb.costControlLeaders?.qsManager || "",
      contractsManager: sb.costControlLeaders?.contractsManager || "",
    },
  });

  const sc = project.sectionC || {};
  const [C2, setC2] = useState({
    typeOfContract: sc.typeOfContract || [],
    paymentTerm:    sc.paymentTerm    || [],
    remarks:        sc.remarks        || "",
  });

  const isRevision   = project.status === "revision";
  const activeRevision = isRevision ? (project.revisions||[]).find(r => r.status === "in_progress") : null;

  const [engineerSubmitted, setEngineerSubmitted] = useState(() => {
    if (isRevision) return false;
    return project.approvalHistory?.some(h => h.stage === "engineer" && h.action === "submitted") || false;
  });
  const [revisionSummary, setRevisionSummary] = useState("");
  const [workingNotes, setWorkingNotes] = useState([]);
  const [qstlClarifications, setQstlClarifications] = useState([]);
  const [qstlReviewMode, setQstlReviewMode] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Mandatory field checks — used for progress bar AND submit gate
  const mandatoryChecks = {
    "Site Area (m²)":              !!B.siteAreaSM,
    "Gross Floor Area (m²)":       !!B.gfaSM,
    "Domestic GFA (m²)":           !!B.domesticGfaSM,
    "Non-Domestic GFA (m²)":       !!B.nonDomesticGfaSM,
    "Construction Floor Area (m²)":!!B.constructionFloorAreaSM,
    "Nature of Project":           B.natureOfProject.length > 0,
    "No. of Blocks & Storeys":     !!B.noOfBlocksStorey,
    "Developer":                   !!B.developer,
    "Commencement Date (Target)":  !!B.dates.commencement.target,
    "OP Date (Target)":            !!B.dates.occupationPermit.target,
    "Practical Completion (Target)":!!B.dates.practicalCompletion.target,
    "Main Contractor":             !!B.mainContractor,
    "Accounting Manager":          !!B.costControlLeaders.accountingManager,
    "Type of Contract":            C2.typeOfContract.length > 0,
    "Payment Term":                C2.paymentTerm.length > 0,
  };
  const mandatoryKeys    = Object.keys(mandatoryChecks);
  const filledCount      = Object.values(mandatoryChecks).filter(Boolean).length;
  const totalCount       = mandatoryKeys.length;
  const progressPct      = Math.round((filledCount / totalCount) * 100);
  const missingFields    = mandatoryKeys.filter(k => !mandatoryChecks[k]);
  const canSubmit = missingFields.length === 0 && (!isRevision || revisionSummary.trim());

  const selectedContractor = CONTRACTORS.find(c => c.name === B.mainContractor);
  const availableLicences  = selectedContractor?.licences || [];

  function setB1(key, val) { setB(b => ({ ...b, [key]: val })); }
  function setBNested(key, sub, val) { setB(b => ({ ...b, [key]: { ...b[key], [sub]: val } })); }
  function setDate(dateKey, field, val) {
    setB(b => ({ ...b, dates: { ...b.dates, [dateKey]: { ...b.dates[dateKey], [field]: val } } }));
  }
  function toggleNature(val) {
    // Single-select — replace current value
    setB(b => ({ ...b, natureOfProject: b.natureOfProject.includes(val) ? [] : [val] }));
  }
  function toggleContract(val) {
    setC2(c => ({ ...c, typeOfContract: c.typeOfContract.includes(val) ? [] : [val] }));
  }
  function togglePayment(val) {
    setC2(c => ({ ...c, paymentTerm: c.paymentTerm.includes(val) ? [] : [val] }));
  }
  function toggleLicence(lic) {
    setB(b => ({ ...b, contractorLicences: b.contractorLicences.includes(lic)
      ? b.contractorLicences.filter(x => x !== lic)
      : [...b.contractorLicences, lic] }));
  }
  function addNote(fieldKey, text) {
    setWorkingNotes(prev => [...prev, { id:Date.now(), fieldKey, text, author:currentUser.name, at:new Date().toISOString() }]);
  }
  function removeNote(id) { setWorkingNotes(prev => prev.filter(n => n.id !== id)); }

  const inp = (active=true) => ({
    height:36, border:`1px solid ${C.border}`, borderRadius:6, padding:"0 10px", fontSize:13,
    color: active ? C.textPri : C.textSec, fontFamily:"inherit",
    background: active ? "#fff" : "#f8fafc", width:"100%",
    cursor: active ? "text" : "default", boxSizing:"border-box",
  });
  const cardSt = { background:"#fff", border:`1px solid ${C.border}`, borderRadius:8, marginBottom:12, overflow:"visible" };
  const fLbl = (text, req=false) => (
    <label style={{ fontSize:12, fontWeight:500, color:C.textSec, marginBottom:6, display:"block" }}>
      {req && <span style={{ color:C.danger, marginRight:2 }}>*</span>}{text}
    </label>
  );

  // Shared props passed to all sub-components
  // WorkingNoteWidget expects: notes, onAdd, onRemove, canSee
  // Sub-components expect: workingNotes, addNote, removeNote, canSeeNotes
  const noteProps = {
    workingNotes, notes: workingNotes,
    addNote, onAdd: addNote,
    removeNote, onRemove: removeNote,
    canSeeNotes, canSee: canSeeNotes,
  };
  const clarProps = { qstlClarifications, setQstlClarifications, isQSTL, qstlReviewMode, currentUser };
  const areaProps = { B, setB1, canEdit, ...noteProps };
  const dateProps = { B, setDate, canEdit, ...noteProps };
  const bdProps   = { B, setBNested, canEdit, ...noteProps };

  function handleEngineerSubmit() {
    if (!canSubmit) { setSubmitAttempted(true); return; }
    setEngineerSubmitted(true);
    let updatedRevisions = project.revisions || [];
    if (isRevision && activeRevision && activeRevision.snapshot) {
      const snap = activeRevision.snapshot;
      const changed = {};
      function diffField(key, oldVal, newVal) {
        const o = (oldVal||"").toString().trim(), n = (newVal||"").toString().trim();
        if (o !== n) changed[key] = { old:o||"—", new:n||"—" };
      }
      [
        ["sectionB.siteAreaSM",        snap.sectionB.siteAreaSM,        B.siteAreaSM],
        ["sectionB.gfaSM",             snap.sectionB.gfaSM,             B.gfaSM],
        ["sectionB.domesticGfaSM",     snap.sectionB.domesticGfaSM,     B.domesticGfaSM],
        ["sectionB.nonDomesticGfaSM",  snap.sectionB.nonDomesticGfaSM,  B.nonDomesticGfaSM],
        ["sectionB.constructionFloorAreaSM", snap.sectionB.constructionFloorAreaSM, B.constructionFloorAreaSM],
        ["sectionB.noOfBlocksStorey",  snap.sectionB.noOfBlocksStorey,  B.noOfBlocksStorey],
        ["sectionB.developer",         snap.sectionB.developer,         B.developer],
        ["sectionB.mainContractor",    snap.sectionB.mainContractor,    B.mainContractor],
        ["sectionB.costControlLeaders.contractsManager", snap.sectionB.costControlLeaders?.contractsManager, B.costControlLeaders.contractsManager],
      ].forEach(([key, o, n]) => diffField(key, o, n));
      ["commencement","siteFormationCommencement","capCommencement","occupationPermit",
       "phasedOccupationPermit","practicalCompletion","sectionalCompletion",
       "consentToAssign","certificateOfCompliance","buildingCovenant"].forEach(dk => {
        diffField(`sectionB.dates.${dk}.target`, snap.sectionB.dates?.[dk]?.target, B.dates[dk]?.target);
        diffField(`sectionB.dates.${dk}.actual`, snap.sectionB.dates?.[dk]?.actual, B.dates[dk]?.actual);
      });
      const oldC = (snap.sectionC.typeOfContract||[]).join(","), newC = (C2.typeOfContract||[]).join(",");
      if (oldC !== newC) changed["sectionC.typeOfContract"] = { old:oldC||"—", new:newC||"—" };
      const oldP = (snap.sectionC.paymentTerm||[]).join(","), newP = (C2.paymentTerm||[]).join(",");
      if (oldP !== newP) changed["sectionC.paymentTerm"] = { old:oldP||"—", new:newP||"—" };
      updatedRevisions = (project.revisions||[]).map(r =>
        r.revisionNo === activeRevision.revisionNo
          ? {
              ...r,
              changedFields: changed,
              reason: revisionSummary.trim(), // summary written here after editing
              hasCASensitiveChange: Object.keys(changed).some(k =>
                CA_SENSITIVE_KEYS.has(k.split(".").slice(0,2).join("."))
              ),
            }
          : r
      );
    }
    onUpdated({
      ...project, sectionB:{ ...B }, sectionC:{ ...C2 },
      stage:"qs_team_leader", status: isRevision ? "revision" : "in_progress",
      revisions:updatedRevisions,
      approvalHistory:[...(project.approvalHistory||[]),{
        stage:"engineer", action: isRevision ? "revision_submitted" : "submitted",
        userUUID:currentUser.uuid, timestamp:new Date().toISOString(),
        returnedToStage:null, note: isRevision ? `Revision ${activeRevision?.revisionNo} submitted` : "",
      }],
      updatedAt:new Date().toISOString(),
    });
  }

  return (
    <div style={{ padding:24 }}>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSec, marginBottom:16 }}>
        <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>All Projects</a>
        <span style={{ color:C.textDis }}>›</span>
        <span>{project.siteCode}</span>
        <span style={{ color:C.textDis }}>›</span>
        <span>Data Entry</span>
        {project.status === "approved" && ["engineer","sic","qs_team_leader"].includes(currentUser.role) && onInitiateRevision && (
          <button onClick={onInitiateRevision} style={{
            marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
            background:"#fff", color:C.warning, border:`1px solid ${C.warning}`,
            borderRadius:6, padding:"0 14px", height:32, fontSize:12,
            fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>
            <i className="ti ti-refresh" style={{ fontSize:13 }} aria-hidden="true" />
            Initiate Revision
          </button>
        )}
      </div>

      {/* Revision banner */}
      {project.status === "revision" && (() => {
        const rev = (project.revisions||[]).find(r => r.status === "in_progress");
        if (!rev) return null;
        return (
          <div style={{ display:"flex", gap:12, background:"#fffbeb", border:`1px solid ${C.warning}`,
            borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
            <i className="ti ti-refresh" style={{ fontSize:18, color:C.warning, flexShrink:0, marginTop:2 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"#92400e", marginBottom:3 }}>
                Revision {rev.revisionNo} in progress — all changes require full re-approval
              </div>
              <div style={{ fontSize:12, color:"#78350f" }}>Summary: <em>{rev.reason}</em></div>
            </div>
          </div>
        );
      })()}

      {!canEdit && !isQSTL && (
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f8fafc",
          border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 12px",
          fontSize:12, color:C.textSec, marginBottom:16 }}>
          <i className="ti ti-eye" style={{ fontSize:14 }} aria-hidden="true" />
          Read-only — held by <strong>{STAGE_LABEL[project.stage]}</strong>.
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
        <div>

          {/* Progress bar */}
          {(isEngineer || isQSTL) && (
            <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8,
              padding:"14px 20px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.textPri }}>Form Progress</div>
                <div style={{ fontSize:13, fontWeight:700,
                  color: progressPct===100 ? C.success : progressPct>=60 ? C.navy : C.warning }}>
                  {progressPct}%
                </div>
              </div>
              <div style={{ height:8, background:"#f1f5f9", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:4, width:`${progressPct}%`,
                  background: progressPct===100 ? C.success : progressPct>=60 ? C.navy : C.warning,
                  transition:"width 0.3s ease" }} />
              </div>
              <div style={{ fontSize:11, color:C.textSec, marginTop:6 }}>
                {filledCount} of {totalCount} required fields completed
                {progressPct===100 && (
                  <span style={{ color:C.success, fontWeight:600, marginLeft:8 }}>
                    <i className="ti ti-circle-check" style={{ fontSize:12 }} aria-hidden="true" /> All required fields complete
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Missing fields warning — shown after submit attempted */}
          {submitAttempted && missingFields.length > 0 && (
            <div style={{ background:"#fff5f5", border:"1px solid #fca5a5", borderRadius:8,
              padding:"12px 16px", marginBottom:12 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.danger, marginBottom:6 }}>
                <i className="ti ti-alert-circle" style={{ fontSize:14, marginRight:4 }} aria-hidden="true" />
                Please complete all required fields before submitting:
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {missingFields.map(f => (
                  <span key={f} style={{ fontSize:11, padding:"2px 8px", borderRadius:4,
                    background:"#fee2e2", color:C.danger, border:"1px solid #fca5a5" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Section A: Project Identifiers (read-only reference) ── */}
          <ProjectIdentifiersBlock project={project} />

          {/* ── Section 1: Site & Floor Areas ── */}
          <div id="sec-areas" style={cardSt}>
            <EE_SecHeader sKey="areas" icon="ti-ruler-2" title="Site & Floor Areas"
              filled={[B.siteAreaSM,B.gfaSM,B.domesticGfaSM,B.nonDomesticGfaSM,B.constructionFloorAreaSM].filter(v=>v).length}
              total={5} secOpen={secOpen} toggleSec={toggleSec} />
            {secOpen.areas && (
              <div style={{ padding:"16px 20px" }}>
                <EE_AreaRow label="Site Area"               smKey="siteAreaSM"              sfKey="siteAreaSF"              req {...areaProps} />
                <EE_AreaRow label="Gross Floor Area (GFA)"  smKey="gfaSM"                   sfKey="gfaSF"                   req {...areaProps} />
                <EE_AreaRow label="Domestic GFA"            smKey="domesticGfaSM"           sfKey="domesticGfaSF"           req {...areaProps} />
                <EE_AreaRow label="Non-Domestic GFA"        smKey="nonDomesticGfaSM"        sfKey="nonDomesticGfaSF"        req {...areaProps} />
                <EE_AreaRow label="Construction Floor Area" smKey="constructionFloorAreaSM" sfKey="constructionFloorAreaSF" req {...areaProps} />
              </div>
            )}
          </div>

          {/* ── Section 2: Building Description ── */}
          <div id="sec-building" style={cardSt}>
            <EE_SecHeader sKey="building" icon="ti-building" title="Building Description"
              filled={[B.natureOfProject.length>0?"x":"",B.noOfBlocksStorey,B.developer].filter(v=>v).length}
              total={3} secOpen={secOpen} toggleSec={toggleSec} />
            {secOpen.building && (
              <div style={{ padding:"16px 20px" }}>
                <div style={{ marginBottom:14 }}>
                  {fLbl("Nature of Project", true)}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {[["residential","Residential"],["retail","Retail"],["office","Office"],
                      ["industrial","Industrial"],["hotel","Hotel"],["data_centre","Data Centre"],
                      ["aa_works","A&A Works"],["others","Others"]].map(([val, label]) => (
                      <label key={val} style={{ display:"flex", alignItems:"center", gap:6,
                        fontSize:12, cursor: canEdit ? "pointer" : "default",
                        color: B.natureOfProject.includes(val) ? C.navy : C.textSec,
                        fontWeight: B.natureOfProject.includes(val) ? 600 : 400 }}>
                        <input type="radio" name="natureOfProject"
                          checked={B.natureOfProject.includes(val)} disabled={!canEdit}
                          onChange={() => canEdit && toggleNature(val)}
                          style={{ accentColor:C.navy }} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <EE_QSTLClar fieldPath="natureOfProject" fieldLabel="Nature of Project" {...clarProps} />
                  <WorkingNoteWidget fieldKey="natureOfProject" {...noteProps} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    {fLbl("No. of Blocks & Storeys", true)}
                    <input value={B.noOfBlocksStorey} readOnly={!canEdit}
                      onChange={e => setB1("noOfBlocksStorey",e.target.value)}
                      placeholder="e.g. 3 Towers x 38 Storeys" style={inp(canEdit)} />
                    <EE_QSTLClar fieldPath="noOfBlocksStorey" fieldLabel="No. of Blocks & Storeys" {...clarProps} />
                    <WorkingNoteWidget fieldKey="noOfBlocksStorey" {...noteProps} />
                  </div>
                  <div>
                    {fLbl("Defect Liability Period")}
                    <select value={B.defectLiabilityPeriod} disabled={!canEdit}
                      onChange={e => setB1("defectLiabilityPeriod",e.target.value)}
                      style={{ ...inp(canEdit), cursor: canEdit ? "pointer" : "default" }}>
                      <option value="">— Select —</option>
                      <option value="12_months">12 Months</option>
                      <option value="16_months">16 Months</option>
                      <option value="3_years">3 Years</option>
                    </select>
                    <WorkingNoteWidget fieldKey="defectLiabilityPeriod" {...noteProps} />
                  </div>
                </div>

                <div style={{ marginBottom:14 }}>
                  {fLbl("Residential Units")}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    {[["tower","Tower"],["villa","Villa"],["house","House"]].map(([k,l]) => (
                      <div key={k}>
                        <div style={{ fontSize:11, color:C.textDis, marginBottom:4 }}>{l}</div>
                        <input value={B.residentialUnits[k]} readOnly={!canEdit}
                          onChange={e => setBNested("residentialUnits",k,e.target.value)}
                          placeholder="Units" style={inp(canEdit)} />
                      </div>
                    ))}
                  </div>
                  <WorkingNoteWidget fieldKey="residentialUnits" {...noteProps} />
                </div>

                <div style={{ marginBottom:14 }}>
                  {fLbl("Carpark Numbers")}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
                    {[["residential","Residential"],["commercial","Commercial"],["visitor","Visitor"],
                      ["motorcycle","Motorcycle"],["bicycle","Bicycle"],["loadingUnloading","Loading/UL"],
                      ["publicVehicle","Public Veh."],["lgvHgvCoach","LGV/HGV"]].map(([k,l]) => (
                      <div key={k}>
                        <div style={{ fontSize:11, color:C.textDis, marginBottom:4 }}>{l}</div>
                        <input value={B.carpark[k]} readOnly={!canEdit}
                          onChange={e => setBNested("carpark",k,e.target.value)}
                          placeholder="No." style={inp(canEdit)} />
                      </div>
                    ))}
                  </div>
                  <WorkingNoteWidget fieldKey="carpark" {...noteProps} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    {fLbl("BeamPlus Target")}
                    <input value={B.beamPlus.target} readOnly={!canEdit}
                      onChange={e => setBNested("beamPlus","target",e.target.value)}
                      placeholder="e.g. Gold, Platinum" style={inp(canEdit)} />
                    <WorkingNoteWidget fieldKey="beamPlus.target" {...noteProps} />
                  </div>
                  <div>
                    {fLbl("BeamPlus Actual")}
                    <input value={B.beamPlus.actual} readOnly={!canEdit}
                      onChange={e => setBNested("beamPlus","actual",e.target.value)}
                      placeholder="e.g. Gold (Provisional)" style={inp(canEdit)} />
                    <WorkingNoteWidget fieldKey="beamPlus.actual" {...noteProps} />
                  </div>
                </div>

                <div style={{ marginBottom:14 }}>
                  {fLbl("Name of Developer", true)}
                  <input value={B.developer} readOnly={!canEdit}
                    onChange={e => setB1("developer",e.target.value)}
                    placeholder="Developer company name" style={inp(canEdit)} />
                  <EE_QSTLClar fieldPath="developer" fieldLabel="Developer" {...clarProps} />
                  <WorkingNoteWidget fieldKey="developer" {...noteProps} />
                </div>

                <div>
                  {fLbl("Project Phasing")}
                  <input value={B.projectPhasing} readOnly={!canEdit}
                    onChange={e => setB1("projectPhasing",e.target.value)}
                    placeholder="e.g. Single phase / Phase 1: …" style={inp(canEdit)} />
                  <WorkingNoteWidget fieldKey="projectPhasing" {...noteProps} />
                </div>
              </div>
            )}
          </div>

          {/* ── Section 3: Key Dates ── */}
          <div id="sec-dates" style={cardSt}>
            <EE_SecHeader sKey="dates" icon="ti-calendar" title="Key Dates"
              filled={[B.dates.commencement.target,B.dates.occupationPermit.target,B.dates.practicalCompletion.target].filter(v=>v).length}
              total={3} secOpen={secOpen} toggleSec={toggleSec} />
            {secOpen.dates && (
              <div style={{ padding:"16px 20px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"170px 1fr 1fr", gap:8,
                  marginBottom:8, paddingBottom:6, borderBottom:`1px solid ${C.border}` }}>
                  {["Date","Target","Actual"].map(h => (
                    <div key={h} style={{ fontSize:11, fontWeight:600, color:C.textSec,
                      textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</div>
                  ))}
                </div>
                <EE_DateRow label="Commencement"          dateKey="commencement"              req {...dateProps} />
                <EE_DateRow label="Site Formation"        dateKey="siteFormationCommencement"     {...dateProps} />
                <EE_DateRow label="Cap Commencement"      dateKey="capCommencement"               {...dateProps} />
                <EE_DateRow label="Occupation Permit (OP)"dateKey="occupationPermit"          req {...dateProps} />
                <EE_DateRow label="Phased OP"             dateKey="phasedOccupationPermit"        {...dateProps} />
                <EE_DateRow label="Practical Completion"  dateKey="practicalCompletion"       req {...dateProps} />
                <EE_DateRow label="Sectional Completion"  dateKey="sectionalCompletion"           {...dateProps} />
                <EE_DateRow label="Consent to Assign"     dateKey="consentToAssign"               {...dateProps} />
                <EE_DateRow label="Cert. of Compliance"   dateKey="certificateOfCompliance"       {...dateProps} />
                <EE_DateRow label="Building Covenant"     dateKey="buildingCovenant"              {...dateProps} />
              </div>
            )}
          </div>

          {/* ── Section 4: Project Team ── */}
          <div id="sec-team" style={cardSt}>
            <EE_SecHeader sKey="team" icon="ti-users" title="Project Team & Consultants"
              filled={0} total={0} secOpen={secOpen} toggleSec={toggleSec} />
            {secOpen.team && (
              <div style={{ padding:"16px 20px" }}>
                <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
                  letterSpacing:"0.04em", marginBottom:10 }}>Client / Developer</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:16 }}>
                  {[["CPM Name","cpm","name"],["CPM Title","cpm","title"],["CPM Email","cpm","email"]].map(([l,k,s]) => (
                    <div key={l}>
                      {fLbl(l)}
                      <input value={B[k][s]} readOnly={!canEdit}
                        onChange={e => setBNested(k,s,e.target.value)} style={inp(canEdit)} />
                      <WorkingNoteWidget fieldKey={`${k}.${s}`} {...noteProps} />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
                  letterSpacing:"0.04em", marginBottom:10 }}>BD Authorisations</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                  <EE_BDRow label="Technical Director (BDTD)"   objKey="technicalDirector"   {...bdProps} />
                  <EE_BDRow label="Authorised Signatory (BDAS)" objKey="authorisedSignatory" {...bdProps} />
                  <EE_BDRow label="Architecture, AP (BDAP)"     objKey="architectureAP"      {...bdProps} />
                </div>
                <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
                  letterSpacing:"0.04em", marginBottom:10 }}>Consultants</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    {fLbl("Design Architect")}
                    <input value={B.designArchitect} readOnly={!canEdit}
                      onChange={e => setB1("designArchitect",e.target.value)} style={inp(canEdit)} />
                    <WorkingNoteWidget fieldKey="designArchitect" {...noteProps} />
                  </div>
                  <EE_BDRow label="Structural Consultant (BDRSE)" objKey="rse" {...bdProps} />
                  <div>
                    {fLbl("M&E Consultant")}
                    <input value={B.meConsultant} readOnly={!canEdit}
                      onChange={e => setB1("meConsultant",e.target.value)} style={inp(canEdit)} />
                    <WorkingNoteWidget fieldKey="meConsultant" {...noteProps} />
                  </div>
                  <EE_BDRow label="Geotechnical Consultant (BDRGE)" objKey="rge" {...bdProps} />
                  {[
                    ["Landscape Consultant","landscapeConsultant"],
                    ["Interior Designer","interiorDesigner"],
                    ["Sustainability Consultant","sustainabilityConsultant"],
                    ["QS Consultant","qsConsultant"],
                    ["Estate Management","estateManagement"],
                  ].map(([l,k]) => (
                    <div key={k}>
                      {fLbl(l)}
                      <input value={B[k]} readOnly={!canEdit}
                        onChange={e => setB1(k,e.target.value)} style={inp(canEdit)} />
                      <WorkingNoteWidget fieldKey={k} {...noteProps} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Section 5: Main Contractor & Cost Control ── */}
          <div id="sec-contractor" style={cardSt}>
            <EE_SecHeader sKey="contractor" icon="ti-hard-hat" title="Main Contractor & Cost Control"
              filled={[B.mainContractor,B.costControlLeaders.accountingManager].filter(v=>v).length}
              total={2} secOpen={secOpen} toggleSec={toggleSec} />
            {secOpen.contractor && (
              <div style={{ padding:"16px 20px" }}>
                <div style={{ marginBottom:14 }}>
                  {fLbl("Main Contractor", true)}
                  <select value={B.mainContractor} disabled={!canEdit}
                    onChange={e => { setB1("mainContractor",e.target.value); setB(b=>({...b,contractorLicences:[]})); }}
                    style={{ ...inp(canEdit), cursor:canEdit?"pointer":"default" }}>
                    <option value="">— Select contractor —</option>
                    {CONTRACTORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <EE_QSTLClar fieldPath="mainContractor" fieldLabel="Main Contractor" {...clarProps} />
                  <WorkingNoteWidget fieldKey="mainContractor" {...noteProps} />
                </div>

                <div style={{ marginBottom:14 }}>
                  {fLbl("Contractor Licence No.")}
                  {!B.mainContractor ? (
                    <div style={{ fontSize:12, color:C.textDis, fontStyle:"italic", padding:"6px 0" }}>
                      Select a main contractor first
                    </div>
                  ) : (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
                      {availableLicences.map(lic => (
                        <label key={lic} style={{
                          display:"flex", alignItems:"center", gap:6, fontSize:12,
                          cursor: canEdit ? "pointer" : "default",
                          padding:"5px 10px", borderRadius:6,
                          border:`1px solid ${B.contractorLicences.includes(lic) ? C.navy : C.border}`,
                          background: B.contractorLicences.includes(lic) ? "#eff6ff" : "#fff",
                          color: B.contractorLicences.includes(lic) ? C.navy : C.textSec,
                          fontFamily:"monospace",
                        }}>
                          <input type="checkbox" disabled={!canEdit}
                            checked={B.contractorLicences.includes(lic)}
                            onChange={() => canEdit && toggleLicence(lic)}
                            style={{ accentColor:C.navy }} />
                          {lic}
                        </label>
                      ))}
                    </div>
                  )}
                  {B.contractorLicences.length > 0 && (
                    <div style={{ fontSize:11, color:C.textSec, marginTop:6 }}>
                      {B.contractorLicences.length} licence{B.contractorLicences.length>1?"s":""} selected
                    </div>
                  )}
                  <WorkingNoteWidget fieldKey="contractorLicences" {...noteProps} />
                </div>

                <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
                  letterSpacing:"0.04em", marginBottom:10 }}>Cost Control Leaders</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                  <div>
                    {fLbl("Accounting Manager", true)}
                    <input value={B.costControlLeaders.accountingManager} readOnly style={{ ...inp(false) }} />
                    <div style={{ fontSize:10, color:C.textDis, marginTop:3 }}>Pre-assigned · read-only</div>
                    <WorkingNoteWidget fieldKey="accountingManager" {...noteProps} />
                  </div>
                  <div>
                    {fLbl("QS Manager")}
                    <input value={B.costControlLeaders.qsManager} readOnly style={{ ...inp(false) }} />
                    <div style={{ fontSize:10, color:C.textDis, marginTop:3 }}>From delegation · read-only</div>
                    <WorkingNoteWidget fieldKey="qsManager" {...noteProps} />
                  </div>
                  <div>
                    {fLbl("Contracts Manager")}
                    <select value={B.costControlLeaders.contractsManager} disabled={!canEdit}
                      onChange={e => setBNested("costControlLeaders","contractsManager",e.target.value)}
                      style={{ ...inp(canEdit), cursor:canEdit?"pointer":"default" }}>
                      <option value="">— Select —</option>
                      {CONTRACTS_MANAGERS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <WorkingNoteWidget fieldKey="contractsManager" {...noteProps} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Section 6: Contract Terms ── */}
          <div id="sec-contract" style={cardSt}>
            <EE_SecHeader sKey="contract" icon="ti-file-description" title="Contract Terms"
              filled={[C2.typeOfContract.length>0?"x":"",C2.paymentTerm.length>0?"x":""].filter(v=>v).length}
              total={2} secOpen={secOpen} toggleSec={toggleSec} />
            {secOpen.contract && (
              <div style={{ padding:"16px 20px" }}>
                {isQSTL && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, background:"#eff6ff",
                    border:"1px solid #bfdbfe", borderRadius:6, padding:"8px 12px",
                    fontSize:12, color:"#1e40af", marginBottom:14 }}>
                    <i className="ti ti-pencil" style={{ fontSize:13 }} aria-hidden="true" />
                    QS Team Leader completes and signs off Contract Terms.
                  </div>
                )}
                <div style={{ marginBottom:16 }}>
                  {fLbl("Type of Contract", true)}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                    {[["inhouse","In-house (Internal Project)"],["jv","JV (External Project)"],
                      ["tender","Tender"],["lump_sum","Lump Sum"],["others","Others"]].map(([val,label]) => (
                      <label key={val} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12,
                        cursor:(canEdit||isQSTL)?"pointer":"default",
                        color:C2.typeOfContract.includes(val)?C.navy:C.textSec,
                        fontWeight:C2.typeOfContract.includes(val)?600:400 }}>
                        <input type="radio" name="typeOfContract"
                          checked={C2.typeOfContract.includes(val)}
                          disabled={!canEdit&&!isQSTL}
                          onChange={() => (canEdit||isQSTL) && toggleContract(val)}
                          style={{ accentColor:C.navy }} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <EE_QSTLClar fieldPath="typeOfContract" fieldLabel="Type of Contract" {...clarProps} />
                  <WorkingNoteWidget fieldKey="typeOfContract" {...noteProps} />
                </div>
                <div style={{ marginBottom:16 }}>
                  {fLbl("Payment Term", true)}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                    {[["monthly_progress","Monthly Progress Payment"],
                      ["scheduled","Scheduled Payment"],["architect_certificate","Architect Certificate"]].map(([val,label]) => (
                      <label key={val} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12,
                        cursor:(canEdit||isQSTL)?"pointer":"default",
                        color:C2.paymentTerm.includes(val)?C.navy:C.textSec,
                        fontWeight:C2.paymentTerm.includes(val)?600:400 }}>
                        <input type="radio" name="paymentTerm"
                          checked={C2.paymentTerm.includes(val)}
                          disabled={!canEdit&&!isQSTL}
                          onChange={() => (canEdit||isQSTL) && togglePayment(val)}
                          style={{ accentColor:C.navy }} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <EE_QSTLClar fieldPath="paymentTerm" fieldLabel="Payment Term" {...clarProps} />
                  <WorkingNoteWidget fieldKey="paymentTerm" {...noteProps} />
                </div>
                <div>
                  {fLbl("Remarks")}
                  <textarea value={C2.remarks} readOnly={!canEdit&&!isQSTL}
                    onChange={e => setC2(c=>({...c,remarks:e.target.value}))}
                    rows={3} placeholder="Additional contract notes…"
                    style={{ width:"100%", boxSizing:"border-box",
                      border:`1px solid ${C.border}`, borderRadius:6,
                      padding:"8px 10px", fontSize:13, fontFamily:"inherit",
                      color:C.textPri, resize:"vertical",
                      background:(canEdit||isQSTL)?"#fff":"#f8fafc" }} />
                  <WorkingNoteWidget fieldKey="contractRemarks" {...noteProps} />
                </div>
                {isQSTL && (
                  <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid #f1f5f9` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <button disabled={!engineerSubmitted}
                        onClick={() => {
                          if (!engineerSubmitted) return;
                          onUpdated({ ...project, stage:"qs_manager",
                            sectionC:{ ...C2, qsTLSignedOff:true },
                            approvalHistory:[...(project.approvalHistory||[]),{
                              stage:"qs_team_leader", action:"approved",
                              userUUID:currentUser.uuid, timestamp:new Date().toISOString(),
                              returnedToStage:null, note:"",
                            }], updatedAt:new Date().toISOString() });
                        }}
                        style={{ display:"flex", alignItems:"center", gap:6,
                          background:engineerSubmitted?C.navy:"#e2e8f0",
                          color:engineerSubmitted?"#fff":"#94a3b8",
                          border:"none", borderRadius:6, padding:"0 20px", height:36,
                          fontSize:13, fontWeight:500,
                          cursor:engineerSubmitted?"pointer":"not-allowed",
                          fontFamily:"inherit" }}>
                        <i className="ti ti-circle-check" style={{ fontSize:14 }} aria-hidden="true" />
                        Approve &amp; Advance to QS Manager
                      </button>
                      <EE_QSTLReturnPanel project={project} currentUser={currentUser} onUpdated={onUpdated} />
                    </div>
                    {!engineerSubmitted && (
                      <div style={{ fontSize:12, color:C.textSec, marginTop:6 }}>
                        Waiting for Engineer to submit before you can advance.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Engineer submit */}
          {isEngineer && (
            <div style={{ background:"#fff", border:`1px solid ${C.border}`,
              borderRadius:8, padding:20, marginBottom:12 }}>
              {/* Summary of Changes — only shown during revision, filled here after editing */}
              {isRevision && !engineerSubmitted && (
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:500, color:C.textSec, display:"block", marginBottom:6 }}>
                    <span style={{ color:C.danger, marginRight:2 }}>*</span>
                    Summary of Changes
                    <span style={{ fontSize:11, color:C.textDis, fontWeight:400, marginLeft:6 }}>
                      Describe what you changed and why — visible to all approvers
                    </span>
                  </label>
                  <textarea
                    value={revisionSummary}
                    onChange={e => setRevisionSummary(e.target.value)}
                    placeholder="e.g. GFA updated following BD approval of amended building plans. OP date pushed by 3 months to reflect revised programme."
                    rows={3}
                    style={{ width:"100%", boxSizing:"border-box",
                      border:`1px solid ${C.border}`, borderRadius:6,
                      padding:"8px 10px", fontSize:13, fontFamily:"inherit",
                      color:C.textPri, resize:"vertical" }}
                  />
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {!engineerSubmitted ? (<>
                  <button onClick={handleEngineerSubmit}
                    style={{ display:"flex", alignItems:"center", gap:6,
                      background: canSubmit ? C.navy : "#94a3b8",
                      color:"#fff", border:"none", borderRadius:6, padding:"0 20px", height:36,
                      fontSize:13, fontWeight:500,
                      cursor: canSubmit ? "pointer" : "not-allowed",
                      fontFamily:"inherit" }}>
                    <i className="ti ti-send" style={{ fontSize:14 }} aria-hidden="true" />
                    {isRevision ? "Submit Revision" : "Submit to QS Team Leader"}
                  </button>
                  <button onClick={() => {}}
                    style={{ background:"#fff", color:C.textPri, border:`1px solid ${C.border}`,
                      borderRadius:6, padding:"0 16px", height:36, fontSize:13,
                      cursor:"pointer", fontFamily:"inherit" }}>Save Draft</button>
                  {!canSubmit && (
                    <span style={{ fontSize:12, color:C.textSec }}>
                      {missingFields.length} required field{missingFields.length>1?"s":""} incomplete
                      {isRevision && !revisionSummary.trim() ? " · Summary required" : ""}
                    </span>
                  )}
                </>) : (
                  <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:C.success, fontWeight:500 }}>
                    <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
                    {isRevision
                      ? "Revision submitted — form advanced to QS Team Leader for re-approval"
                      : "Submitted — form advanced to QS Team Leader for review"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* QS TL review mode toggle */}
          {isQSTL && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <button onClick={() => setQstlReviewMode(m => !m)}
                style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:500,
                  background: qstlReviewMode ? "#fffbeb" : "#fff",
                  color: qstlReviewMode ? "#92400e" : C.textSec,
                  border:`1px solid ${qstlReviewMode ? "#d97706" : C.border}`,
                  borderRadius:6, padding:"0 14px", height:32, cursor:"pointer", fontFamily:"inherit" }}>
                <i className="ti ti-message-question" style={{ fontSize:13 }} aria-hidden="true" />
                {qstlReviewMode ? "Exit Review Mode" : "Review Mode"}
              </button>
              {qstlReviewMode && (
                <span style={{ fontSize:12, color:"#92400e" }}>Click any field to request clarification from Engineer</span>
              )}
            </div>
          )}

        </div>

        {/* Right sidebar */}
        <div style={{ position:"sticky", top:24 }}>
          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8, padding:16, marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
              letterSpacing:"0.04em", marginBottom:12 }}>Project</div>
            {[
              { label:"Site Code",   value:project.siteCode, mono:true },
              { label:"Short Name",  value:project.shortName },
              { label:"PIC",         value:getUser(project.assignedRoles?.pic)?.name||"—" },
              { label:"QS Manager",  value:getUser(project.assignedRoles?.qsManager)?.name||"—" },
              { label:"SIC",         value:getUser(project.assignedRoles?.sic)?.name||"—" },
              { label:"Engineer",    value:getUser(project.assignedRoles?.engineer)?.name||"—" },
              { label:"QS TL",       value:getUser(project.assignedRoles?.qsTeamLeader)?.name||"—" },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ paddingBottom:6, marginBottom:6, borderBottom:"1px solid #f8fafc" }}>
                <div style={{ fontSize:11, color:C.textDis, fontWeight:500 }}>{label}</div>
                <div style={{ fontSize:13, color:C.textPri, fontWeight:500,
                  fontFamily:mono?"'SF Mono',Consolas,monospace":"inherit" }}>{value||"—"}</div>
              </div>
            ))}
            {/* Edit Assignments button — visible to all, active for PIC and QS Manager */}
            {onEditAssignments && (() => {
              const canEdit = currentUser.role === "pic" || currentUser.role === "qs_manager"
                || currentUser.uuid === project.assignedRoles?.pic
                || currentUser.uuid === project.assignedRoles?.qsManager;
              return (
                <button
                  onClick={canEdit ? onEditAssignments : undefined}
                  title={canEdit ? "Edit team assignments" : "Only PIC or QS Manager can edit assignments"}
                  style={{ width:"100%", marginTop:8, display:"flex", alignItems:"center", gap:6,
                    justifyContent:"center", height:32, borderRadius:6, fontSize:12, fontWeight:500,
                    background: canEdit ? "#eff6ff" : "#f8fafc",
                    color: canEdit ? C.midBlue : C.textDis,
                    border: `1px solid ${canEdit ? "#bfdbfe" : C.border}`,
                    cursor: canEdit ? "pointer" : "default",
                    fontFamily:"inherit" }}>
                  <i className="ti ti-pencil" style={{ fontSize:12 }} aria-hidden="true" />
                  Edit Assignments
                  {!canEdit && <i className="ti ti-lock" style={{ fontSize:11, marginLeft:"auto", opacity:0.5 }} aria-hidden="true" />}
                </button>
              );
            })()}
            {workingNotes.length > 0 && canSeeNotes && (
              <div style={{ marginTop:8, padding:"8px 10px", background:"#f0fdfa",
                border:"1px solid #0d9488", borderRadius:6 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#0f766e", marginBottom:2 }}>
                  <i className="ti ti-notes" style={{ fontSize:12 }} aria-hidden="true" /> Working Notes ({workingNotes.length})
                </div>
                <div style={{ fontSize:11, color:"#0d9488" }}>Visible to Engineer &amp; QS TL only</div>
              </div>
            )}
            <div style={{ marginTop:12 }}>
              <Stepper currentStage={engineerSubmitted ? "qs_team_leader" : project.stage} />
            </div>
          </div>

          {/* Quick navigation */}
          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
              letterSpacing:"0.04em", marginBottom:10 }}>Jump to Section</div>
            {[
              { key:"areas",      id:"sec-areas",      label:"Site & Areas",    done:[B.siteAreaSM,B.gfaSM,B.domesticGfaSM,B.nonDomesticGfaSM,B.constructionFloorAreaSM].every(v=>v) },
              { key:"building",   id:"sec-building",   label:"Building Desc.",  done:B.natureOfProject.length>0&&!!B.noOfBlocksStorey&&!!B.developer },
              { key:"dates",      id:"sec-dates",      label:"Key Dates",       done:!!B.dates.commencement.target&&!!B.dates.occupationPermit.target&&!!B.dates.practicalCompletion.target },
              { key:"team",       id:"sec-team",       label:"Project Team",    done:false },
              { key:"contractor", id:"sec-contractor", label:"Contractor",      done:!!B.mainContractor },
              { key:"contract",   id:"sec-contract",   label:"Contract Terms",  done:C2.typeOfContract.length>0&&C2.paymentTerm.length>0 },
            ].map(({ key, id, label, done }) => (
              <div key={key}
                onClick={() => {
                  // Expand if collapsed
                  if (!secOpen[key]) toggleSec(key);
                  // Scroll after a tick to allow render
                  setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
                  }, 50);
                }}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px",
                  borderRadius:5, cursor:"pointer", marginBottom:2,
                  background:"transparent",
                  transition:"background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <i className={`ti ${done?"ti-circle-check":"ti-circle"}`}
                  style={{ fontSize:14, color:done?C.success:C.textDis, flexShrink:0 }} aria-hidden="true" />
                <span style={{ fontSize:12, color:done?C.success:C.textPri, flex:1 }}>{label}</span>
                <i className="ti ti-arrow-right" style={{ fontSize:11, color:C.textDis }} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// Approval stage order for return-to options
const APPROVAL_STAGES = ["engineer","qs_team_leader","qs_manager","sic","pic","gm"];
const RETURN_OPTIONS = {
  qs_team_leader: ["engineer"],
  qs_manager:     ["engineer","qs_team_leader"],
  sic:            ["engineer","qs_team_leader","qs_manager"],
  pic:            ["engineer","qs_team_leader","qs_manager","sic"],
  gm:             ["engineer","qs_team_leader","qs_manager","sic","pic"],
};

function ApprovalView({ currentUser, project, onBack, onUpdated, onViewDiff, readOnly, onInitiateRevision, onEditAssignments }) {
  const role = currentUser.role;
  const isComplete = project.stage === "complete";

  // Check if this user is the active approver for this stage
  // Either their role matches the stage, OR they are the specifically assigned person for that role
  const STAGE_ASSIGNMENT_KEY = {
    qs_team_leader: "qsTeamLeader",
    qs_manager:     "qsManager",
    sic:            "sic",
    pic:            "pic",
    gm:             null, // GM is role-based, not assigned per project
  };
  const assignmentKey = STAGE_ASSIGNMENT_KEY[project.stage];
  const assignedUUID  = assignmentKey ? project.assignedRoles?.[assignmentKey] : null;
  const roleMatchesStage = project.stage === role;
  const uuidMatchesAssignment = assignedUUID && currentUser.uuid === assignedUUID;
  const isActiveApprover = !readOnly && !isComplete &&
    (roleMatchesStage || uuidMatchesAssignment);

  // Clarification requests state
  const [clarifications, setClarifications] = useState(
    (project.clarificationRequests || []).map(c => ({ ...c }))
  );

  // Return for revision state
  const [showReturn, setShowReturn] = useState(false);
  const [returnStage, setReturnStage] = useState("");
  const [returnNote, setReturnNote] = useState("");

  // Action state
  const [approved, setApproved] = useState(false);
  const [returned, setReturned] = useState(false);

  const openClarifications = clarifications.filter(c => c.status === "open");
  const canApprove = isActiveApprover && openClarifications.length === 0 && !approved;

  // Eligible recipients: only roles that appear BEFORE the current approver
  // in the approval chain, resolved to the actual assigned person on this project
  const CHAIN_BEFORE = {
    qs_team_leader: ["engineer"],
    qs_manager:     ["engineer","qs_team_leader"],
    sic:            ["engineer","qs_team_leader","qs_manager"],
    pic:            ["engineer","qs_team_leader","qs_manager","sic"],
    gm:             ["engineer","qs_team_leader","qs_manager","sic","pic"],
  };
  const ROLE_TO_ASSIGNMENT_KEY = {
    engineer: "engineer", qs_team_leader: "qsTeamLeader",
    qs_manager: "qsManager", sic: "sic", pic: "pic",
  };
  const eligibleRoles = CHAIN_BEFORE[role] || [];
  const clarificationRecipients = eligibleRoles
    .map(r => {
      const assignmentKey = ROLE_TO_ASSIGNMENT_KEY[r];
      const assignedUUID = project.assignedRoles?.[assignmentKey];
      return assignedUUID ? getUser(assignedUUID) : null;
    })
    .filter(Boolean);

  function addClarification(fieldPath, fieldLabel, recipientUUID, question) {
    const cr = {
      id: "cr-" + Date.now(),
      fieldPath,
      fieldLabel,
      askedBy: currentUser.uuid,
      askedAt: new Date().toISOString(),
      question,
      recipientUUID,
      status: "open",
      reply: "",
      replyAt: null,
      fieldUpdated: false,
      oldValue: "",
      newValue: "",
    };
    setClarifications(prev => [...prev, cr]);
  }

  function replyToClarification(id, reply) {
    setClarifications(prev => prev.map(c =>
      c.id === id ? { ...c, reply, replyAt: new Date().toISOString(), status: "resolved" } : c
    ));
  }

  function updateFieldValue(id, oldValue, newValue) {
    setClarifications(prev => prev.map(c =>
      c.id === id ? {
        ...c,
        status: "resolved",
        replyAt: new Date().toISOString(),
        fieldUpdated: true,
        oldValue,
        newValue,
      } : c
    ));
  }

  function resolveClarification(id, reply, fieldUpdate) {
    // fieldUpdate = null | { oldValue, newValue }
    setClarifications(prev => prev.map(c =>
      c.id === id ? {
        ...c,
        reply,
        replyAt: new Date().toISOString(),
        status: "resolved",
        fieldUpdated: fieldUpdate ? true : false,
        oldValue: fieldUpdate ? fieldUpdate.oldValue : "",
        newValue: fieldUpdate ? fieldUpdate.newValue : "",
      } : c
    ));
  }

  function handleApprove() {
    const NEXT = {
      qs_team_leader: "qs_manager", qs_manager: "sic", sic: "pic", pic: "gm", gm: "cost_account",
    };
    const nextStage = NEXT[role] || role;
    const isGM = role === "gm";
    const isRevision = project.status === "revision";

    // For revision flow: record approval in the active revision's approvalHistory
    let updatedRevisions = project.revisions || [];
    if (isRevision) {
      updatedRevisions = updatedRevisions.map(r => {
        if (r.status !== "in_progress") return r;
        return {
          ...r,
          status: isGM ? "approved" : "in_progress",
          approvalHistory: [...(r.approvalHistory || []), {
            stage: role,
            action: "approved",
            userUUID: currentUser.uuid,
            timestamp: new Date().toISOString(),
          }],
        };
      });
    }

    const updated = {
      ...project,
      stage: nextStage,
      // Revision: keep "revision" status through chain; GM approval resets to "approved"
      status: isGM ? "approved" : project.status,
      revisions: updatedRevisions,
      approvalHistory: [...(project.approvalHistory || []), {
        stage: role,
        action: "approved",
        userUUID: currentUser.uuid,
        timestamp: new Date().toISOString(),
        returnedToStage: null,
        note: isRevision ? `Revision ${(project.revisions||[]).find(r=>r.status==="in_progress")?.revisionNo} approved` : "",
      }],
      clarificationRequests: clarifications,
      updatedAt: new Date().toISOString(),
    };
    setApproved(true);
    onUpdated(updated);
  }

  function handleReturn() {
    if (!returnStage) return;
    const updated = {
      ...project,
      stage: returnStage,
      approvalHistory: [...(project.approvalHistory || []), {
        stage: role, action: "returned",
        userUUID: currentUser.uuid,
        timestamp: new Date().toISOString(),
        returnedToStage: returnStage, note: returnNote,
      }],
      clarificationRequests: clarifications,
      updatedAt: new Date().toISOString(),
    };
    setReturned(true);
    setShowReturn(false);
    onUpdated(updated);
  }

  const B  = project.sectionB  || {};
  const C2 = project.sectionC  || {};
  const A  = project.sectionA  || project;

  const cardStyle = {
    background: "#fff", border: `1px solid ${C.border}`,
    borderRadius: 8, padding: 24, marginBottom: 16, overflow: "visible",
  };
  const secTitle = (icon, text) => (
    <div style={{ fontSize: 15, fontWeight: 600, color: C.textPri, marginBottom: 16,
      paddingBottom: 10, borderBottom: `1px solid #f1f5f9`,
      display: "flex", alignItems: "center", gap: 8 }}>
      <i className={`ti ${icon}`} style={{ color: C.navy, fontSize: 16 }} aria-hidden="true" />
      {text}
    </div>
  );
  const roVal = (v) => (
    <div style={{ height: 36, border: `1px solid ${C.border}`, borderRadius: 6,
      padding: "0 10px", fontSize: 13, color: C.textSec, background: "#f8fafc",
      display: "flex", alignItems: "center", width: "100%" }}>
      {v || <span style={{ color: C.textDis, fontStyle: "italic" }}>—</span>}
    </div>
  );
  const fieldLabel = (text, req = false) => (
    <label style={{ fontSize: 12, fontWeight: 500, color: C.textSec, marginBottom: 6, display: "block" }}>
      {req && <span style={{ color: C.danger, marginRight: 2 }}>*</span>}{text}
    </label>
  );

  // Per-field clarification widget
  function ClarificationWidget({ fieldPath, fieldLabel: fLabel, fieldValue }) {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [recipient, setRecipient] = useState("");
    const existing = clarifications.filter(c => c.fieldPath === fieldPath);
    const isRecipient = existing.some(c => c.recipientUUID === currentUser.uuid && c.status === "open");
    const [replyDraft, setReplyDraft] = useState("");
    const [showUpdateField, setShowUpdateField] = useState(false);
    const [newValueDraft, setNewValueDraft] = useState(fieldValue || "");

    // In read-only mode (complete project) — no clarification controls
    if (readOnly || isComplete) return null;

    return (
      <div style={{ marginTop: 4 }}>
        {/* Existing threads */}
        {existing.map(cr => (
          <div key={cr.id} style={{
            background: cr.status === "open" ? "#fffbeb" : "#f0fdf4",
            border: `1px solid ${cr.status === "open" ? "#d97706" : "#86efac"}`,
            borderRadius: 6, padding: "10px 12px", marginBottom: 6, fontSize: 12,
          }}>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
              <i className="ti ti-message-question" style={{ fontSize: 14, color: cr.status === "open" ? "#d97706" : "#16a34a", marginTop: 1, flexShrink: 0 }} aria-hidden="true" />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, color: cr.status === "open" ? "#92400e" : "#15803d" }}>
                  {getUser(cr.askedBy)?.name}
                </span>
                <span style={{ color: C.textSec, marginLeft: 6, fontSize: 11 }}>
                  {new Date(cr.askedAt).toLocaleString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                </span>
                <div style={{ marginTop: 2, color: C.textPri }}>{cr.question}</div>
                <div style={{ fontSize: 11, color: C.textSec, marginTop: 2 }}>
                  → {getUser(cr.recipientUUID)?.name}
                </div>
              </div>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 8, flexShrink: 0,
                background: cr.status === "open" ? "#fef9c3" : "#dcfce7",
                color: cr.status === "open" ? "#854d0e" : "#15803d", fontWeight: 500 }}>
                {cr.status === "open" ? "Open" : "Resolved"}
              </span>
            </div>
            {cr.reply && (
              <div style={{ marginLeft: 20, marginTop: 6, padding: "6px 10px",
                background: "#fff", borderRadius: 4, border: `1px solid ${C.border}`,
                fontSize: 12, color: C.textPri }}>
                <span style={{ fontWeight: 600 }}>{getUser(cr.recipientUUID)?.name}</span>
                <span style={{ color: C.textSec, marginLeft: 6, fontSize: 11 }}>
                  {cr.replyAt && new Date(cr.replyAt).toLocaleString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                </span>
                <div style={{ marginTop: 2 }}>{cr.reply}</div>
              </div>
            )}
            {/* Field update diff — shown when recipient updated the value */}
            {cr.fieldUpdated && (
              <div style={{ marginLeft: 20, marginTop: 6, padding: "6px 10px",
                background: "#fff", borderRadius: 4, border: `1px solid #86efac`, fontSize: 12 }}>
                <div style={{ fontSize: 11, color: C.textSec, marginBottom: 4, fontWeight: 500 }}>
                  Field updated by {getUser(cr.recipientUUID)?.name}
                </div>
                <div style={{ textDecoration: "line-through", color: C.textDis }}>{cr.oldValue || "—"}</div>
                <div style={{ color: "#15803d", fontWeight: 500, marginTop: 2 }}>{cr.newValue || "—"}</div>
              </div>
            )}
            {/* Reply + optional field update — shown to recipient if open */}
            {cr.status === "open" && cr.recipientUUID === currentUser.uuid && (
              <div style={{ marginLeft: 20, marginTop: 8 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input value={replyDraft} onChange={e => setReplyDraft(e.target.value)}
                    placeholder="Type your reply…"
                    style={{ flex: 1, height: 30, border: `1px solid ${C.border}`, borderRadius: 5,
                      padding: "0 8px", fontSize: 12, fontFamily: "inherit" }} />
                </div>
                {/* Update field value toggle */}
                {!showUpdateField ? (
                  <button onClick={() => { setShowUpdateField(true); setNewValueDraft(fieldValue || ""); }}
                    style={{ fontSize: 11, color: C.midBlue, background: "none", border: "none",
                      cursor: "pointer", fontFamily: "inherit", padding: 0,
                      display: "flex", alignItems: "center", gap: 3, marginBottom: 8 }}>
                    <i className="ti ti-edit" style={{ fontSize: 11 }} aria-hidden="true" />
                    Also update field value
                  </button>
                ) : (
                  <div style={{ marginBottom: 8, padding: "8px 10px", background: "#fff",
                    border: `1px solid ${C.border}`, borderRadius: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: C.textSec }}>
                        New value for: <em>{cr.fieldLabel}</em>
                      </div>
                      <button onClick={() => setShowUpdateField(false)}
                        style={{ background: "none", border: "none", cursor: "pointer",
                          color: C.textDis, fontSize: 13, lineHeight: 1, padding: 0 }}>✕</button>
                    </div>
                    <input value={newValueDraft} onChange={e => setNewValueDraft(e.target.value)}
                      placeholder="New value…"
                      style={{ width: "100%", height: 30, border: `1px solid ${C.border}`, borderRadius: 5,
                        padding: "0 8px", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                )}
                <button
                  onClick={() => {
                    const fieldUpdate = showUpdateField && newValueDraft.trim() && newValueDraft.trim() !== (fieldValue || "")
                      ? { oldValue: fieldValue || "", newValue: newValueDraft.trim() }
                      : null;
                    resolveClarification(cr.id, replyDraft, fieldUpdate);
                    setReplyDraft("");
                    setShowUpdateField(false);
                    setNewValueDraft("");
                  }}
                  disabled={!replyDraft.trim()}
                  style={{
                    background: replyDraft.trim() ? C.navy : "#e2e8f0",
                    color: replyDraft.trim() ? "#fff" : C.textDis,
                    border: "none", borderRadius: 5, padding: "0 12px", height: 30,
                    fontSize: 12, cursor: replyDraft.trim() ? "pointer" : "not-allowed",
                    fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
                  }}>
                  <i className="ti ti-send" style={{ fontSize: 12 }} aria-hidden="true" />
                  Send reply{showUpdateField && newValueDraft.trim() && newValueDraft.trim() !== (fieldValue || "") ? " & update value" : ""}
                </button>
              </div>
            )}
          </div>
        ))}
        {/* Ask clarification button — active approver only, not QS TL, no existing open on this field */}
        {isActiveApprover && role !== "qs_team_leader" && !existing.some(c => c.status === "open") && (
          !open ? (
            <button onClick={() => setOpen(true)}
              style={{ fontSize: 11, color: "#d97706", background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 3 }}>
              <i className="ti ti-message-question" style={{ fontSize: 11 }} aria-hidden="true" />
              Request clarification
            </button>
          ) : (
            <div style={{ background: "#fffbeb", border: "1px solid #d97706", borderRadius: 6, padding: "10px 12px", marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#92400e", marginBottom: 8 }}>
                Request clarification on: <em>{fLabel}</em>
              </div>
              <select value={recipient} onChange={e => setRecipient(e.target.value)}
                style={{ height: 30, border: `1px solid ${C.border}`, borderRadius: 5, padding: "0 8px",
                  fontSize: 12, fontFamily: "inherit", background: "#fff", marginBottom: 6, width: "100%" }}>
                <option value="">— Select recipient —</option>
                {clarificationRecipients.map(u => (
                  <option key={u.uuid} value={u.uuid}>{u.name} — {ROLE_LABELS[u.role]}</option>
                ))}
              </select>
              <textarea value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="Describe what needs clarification…" rows={2}
                style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 5,
                  padding: "6px 8px", fontSize: 12, fontFamily: "inherit", resize: "none",
                  boxSizing: "border-box", marginBottom: 6 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => { if (recipient && question.trim()) { addClarification(fieldPath, fLabel, recipient, question.trim()); setOpen(false); setQuestion(""); setRecipient(""); } }}
                  disabled={!recipient || !question.trim()}
                  style={{ background: recipient && question.trim() ? "#d97706" : "#e2e8f0",
                    color: recipient && question.trim() ? "#fff" : C.textDis,
                    border: "none", borderRadius: 5, padding: "0 12px", height: 28,
                    fontSize: 12, cursor: recipient && question.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                  Send
                </button>
                <button onClick={() => { setOpen(false); setQuestion(""); setRecipient(""); }}
                  style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 5,
                    padding: "0 10px", height: 28, fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>
                  Cancel
                </button>
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  // Read-only field row with clarification widget
  function ROField({ label, value, fieldPath, req }) {
    const updatedClar = clarifications.find(c => c.fieldPath === fieldPath && c.fieldUpdated);
    return (
      <div style={{ marginBottom: 14 }}>
        {fieldLabel(label, req)}
        {updatedClar ? (
          <div style={{ border: `1px solid #86efac`, borderRadius: 6, padding: "6px 10px",
            background: "#f0fdf4", fontSize: 13 }}>
            <div style={{ textDecoration: "line-through", color: C.textDis }}>{updatedClar.oldValue || "—"}</div>
            <div style={{ color: "#15803d", fontWeight: 500, marginTop: 2 }}>{updatedClar.newValue || "—"}</div>
            <div style={{ fontSize: 11, color: C.textDis, marginTop: 3 }}>
              Updated by {getUser(updatedClar.recipientUUID)?.name}
            </div>
          </div>
        ) : roVal(value)}
        <ClarificationWidget fieldPath={fieldPath} fieldLabel={label} fieldValue={value} />
      </div>
    );
  }

  function ROFieldInline({ label, value, fieldPath, req }) {
    const updatedClar = clarifications.find(c => c.fieldPath === fieldPath && c.fieldUpdated);
    return (
      <div>
        {fieldLabel(label, req)}
        {updatedClar ? (
          <div style={{ border: `1px solid #86efac`, borderRadius: 6, padding: "6px 10px",
            background: "#f0fdf4", fontSize: 13 }}>
            <div style={{ textDecoration: "line-through", color: C.textDis }}>{updatedClar.oldValue || "—"}</div>
            <div style={{ color: "#15803d", fontWeight: 500, marginTop: 2 }}>{updatedClar.newValue || "—"}</div>
            <div style={{ fontSize: 11, color: C.textDis, marginTop: 3 }}>
              Updated by {getUser(updatedClar.recipientUUID)?.name}
            </div>
          </div>
        ) : roVal(value)}
        <ClarificationWidget fieldPath={fieldPath} fieldLabel={label} fieldValue={value} />
      </div>
    );
  }

  // Date display row
  function RODateRow({ label, dateKey, req }) {
    const d = B.dates?.[dateKey] || {};
    return (
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", gap: 8,
        alignItems: "start", padding: "6px 0", borderBottom: "1px solid #f8fafc" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: C.textSec, paddingTop: 8 }}>
          {req && <span style={{ color: C.danger, marginRight: 2 }}>*</span>}{label}
        </div>
        <div>
          {roVal(d.target)}
          <ClarificationWidget fieldPath={`dates.${dateKey}.target`} fieldLabel={`${label} (Target)`} fieldValue={d.target} />
        </div>
        <div>
          {roVal(d.actual)}
        </div>
      </div>
    );
  }

  const approvalStageDisplay = {
    qs_manager: "QS Manager", sic: "SIC", pic: "PIC", gm: "GM",
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textSec, marginBottom: 16 }}>
        <a onClick={onBack} style={{ color: C.midBlue, cursor: "pointer" }}>All Projects</a>
        <span style={{ color: C.textDis }}>›</span>
        <span>{project.siteCode}</span>
        <span style={{ color: C.textDis }}>›</span>
        <span>{isComplete ? "Project View" : `Approval — ${ROLE_LABELS[role]}`}</span>
        {isComplete && ["engineer","sic","qs_team_leader"].includes(currentUser.role) && onInitiateRevision && (
          <button onClick={onInitiateRevision} style={{
            marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
            background:"#fff", color:C.warning, border:`1px solid ${C.warning}`,
            borderRadius:6, padding:"0 14px", height:32, fontSize:12,
            fontWeight:500, cursor:"pointer", fontFamily:"inherit",
          }}>
            <i className="ti ti-refresh" style={{ fontSize:13 }} aria-hidden="true" />
            Initiate Revision
          </button>
        )}
      </div>

      {/* Complete banner */}
      {isComplete && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdf4",
          border:"1px solid #86efac", borderRadius:6, padding:"10px 14px",
          fontSize:13, color:"#166534", marginBottom:16 }}>
          <i className="ti ti-circle-check" style={{ fontSize:16, flexShrink:0 }} aria-hidden="true" />
          Project data sheet created. To revise any project data, use Initiate Revision.
        </div>
      )}

      {/* Revision in-progress — compact info strip (no View Changes button) */}
      {project.status === "revision" && (() => {
        const rev = (project.revisions||[]).find(r => r.status === "in_progress");
        if (!rev) return null;
        return (
          <div style={{ display:"flex", alignItems:"center", gap:8,
            background:"#fffbeb", border:`1px solid ${C.warning}`,
            borderRadius:8, padding:"9px 14px", marginBottom:16,
            fontSize:12, color:"#92400e" }}>
            <i className="ti ti-refresh" style={{ fontSize:14, flexShrink:0 }} aria-hidden="true" />
            <strong>Revision {rev.revisionNo} in progress</strong>
            <span style={{ color:"#78350f", marginLeft:4 }}>
              · Initiated by {getUser(rev.triggeredBy)?.name} · {fmtDate(rev.triggeredAt)}
            </span>
          </div>
        );
      })()}

      {/* Role notice */}
      {!isActiveApprover && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc",
          border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px",
          fontSize: 12, color: C.textSec, marginBottom: 16 }}>
          <i className="ti ti-eye" style={{ fontSize: 14 }} aria-hidden="true" />
          You are viewing as <strong>{ROLE_LABELS[role]}</strong>. This form is currently held by <strong>{STAGE_LABEL[project.stage]}</strong>.
        </div>
      )}

      {/* Approved banner */}
      {approved && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#dcfce7",
          border: "1px solid #86efac", borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: "#15803d", marginBottom: 16 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 16 }} aria-hidden="true" />
          {role === "gm"
            ? "GM approved — project status set to Approved. Form advancing to Cost Account for finance code assignment."
            : `Approved by ${ROLE_LABELS[role]} — form advancing to ${STAGE_LABEL[{qs_team_leader:"qs_manager",qs_manager:"sic",sic:"pic",pic:"gm"}[role]||"cost_account"]}.`}
        </div>
      )}

      {/* Returned banner */}
      {returned && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fee2e2",
          border: "1px solid #fca5a5", borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: "#991b1b", marginBottom: 16 }}>
          <i className="ti ti-arrow-back-up" style={{ fontSize: 16 }} aria-hidden="true" />
          Form returned to <strong>{STAGE_LABEL[returnStage]}</strong> for revision.
        </div>
      )}

      {/* Open clarification notice */}
      {openClarifications.length > 0 && isActiveApprover && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fffbeb",
          border: "1px solid #d97706", borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: "#92400e", marginBottom: 16 }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 16 }} aria-hidden="true" />
          <strong>{openClarifications.length} open clarification{openClarifications.length > 1 ? "s" : ""}</strong>
          &nbsp;— approval is held until all are resolved.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20, alignItems: "start" }}>
        <div>

          {/* ── REVISION MODE: tabbed layout ── */}
          {project.status === "revision" ? (() => {
            const rev = (project.revisions||[]).find(r => r.status === "in_progress");
            const changedEntries = rev ? Object.entries(rev.changedFields || {}) : [];
            const hasChanges = changedEntries.length > 0;

            // Per-row query state — keyed by changed field key
            const [queryOpen,   setQueryOpen]   = useState(null);
            const [queryDraft,  setQueryDraft]  = useState("");
            const [queryRecip,  setQueryRecip]  = useState("");
            const [activeTab,   setActiveTab]   = useState("changes");

            function submitQuery(fieldKey) {
              if (!queryDraft.trim() || !queryRecip) return;
              addClarification(fieldKey, DIFF_FIELD_LABELS[fieldKey] || fieldKey, queryRecip, queryDraft.trim());
              setQueryOpen(null);
              setQueryDraft("");
              setQueryRecip("");
            }

            const tabSt = (key) => ({
              padding:"8px 20px", fontSize:13, fontWeight:600, cursor:"pointer",
              border:"none", fontFamily:"inherit",
              background: activeTab === key ? "#fff" : "transparent",
              color: activeTab === key ? C.navy : C.textSec,
              borderBottom: activeTab === key ? `2px solid ${C.navy}` : "2px solid transparent",
            });

            return (
              <>
                {/* Tab bar */}
                <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`,
                  marginBottom:16, background:"#f8fafc", borderRadius:"8px 8px 0 0",
                  overflow:"hidden" }}>
                  <button style={tabSt("changes")} onClick={() => setActiveTab("changes")}>
                    <i className="ti ti-arrows-diff" style={{ fontSize:13, marginRight:5 }} aria-hidden="true" />
                    Changes Summary
                    {hasChanges && (
                      <span style={{ marginLeft:6, fontSize:10, fontWeight:700,
                        background:C.navy, color:"#fff", padding:"1px 6px", borderRadius:8 }}>
                        {changedEntries.length}
                      </span>
                    )}
                  </button>
                  <button style={tabSt("full")} onClick={() => setActiveTab("full")}>
                    <i className="ti ti-file-text" style={{ fontSize:13, marginRight:5 }} aria-hidden="true" />
                    Full Data Sheet
                  </button>
                </div>

                {/* ── Tab: Changes Summary ── */}
                {activeTab === "changes" && (
                  <div>
                    {/* Revision meta card */}
                    <div style={{ ...cardStyle, borderLeft:`4px solid ${C.warning}`, marginBottom:16 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, marginBottom: rev?.summary ? 12 : 0 }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:C.textPri, marginBottom:4 }}>
                            Revision {rev?.revisionNo} — {getUser(rev?.triggeredBy)?.name}
                          </div>
                          <div style={{ fontSize:12, color:C.textSec }}>
                            {fmtDate(rev?.triggeredAt)} · {changedEntries.length} field{changedEntries.length !== 1 ? "s" : ""} changed
                          </div>
                        </div>
                        {rev?.hasCASensitiveChange && (
                          <span style={{ fontSize:11, fontWeight:700, background:"#fff7ed",
                            color:"#c2410c", padding:"3px 10px", borderRadius:6,
                            border:"1px solid #fed7aa", alignSelf:"flex-start", flexShrink:0 }}>
                            COST ACCOUNT IMPACT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize:13, color:C.textPri, background:"#fafafa",
                        borderRadius:6, padding:"8px 12px" }}>
                        <span style={{ fontSize:11, fontWeight:600, color:C.textSec,
                          textTransform:"uppercase", letterSpacing:"0.04em", display:"block", marginBottom:3 }}>Summary of Changes</span>
                        {rev?.reason}
                      </div>
                    </div>

                    {/* Diff table */}
                    <div style={cardStyle}>
                      <div style={{ fontSize:14, fontWeight:600, color:C.textPri, marginBottom:14,
                        paddingBottom:10, borderBottom:`1px solid #f1f5f9`,
                        display:"flex", alignItems:"center", gap:8 }}>
                        <i className="ti ti-arrows-diff" style={{ color:C.navy, fontSize:15 }} aria-hidden="true" />
                        Field Changes
                      </div>

                      {!hasChanges ? (
                        <div style={{ padding:"28px 0", textAlign:"center" }}>
                          <i className="ti ti-edit" style={{ fontSize:26, color:C.textDis, display:"block", marginBottom:8 }} aria-hidden="true" />
                          <div style={{ fontSize:13, color:C.textSec }}>No field changes recorded yet — Engineer is currently editing.</div>
                        </div>
                      ) : (
                        <>
                          {/* Table header */}
                          <div style={{ display:"grid", gridTemplateColumns:"180px 1fr 1fr 120px",
                            background:"#f8fafc", border:`1px solid ${C.border}`,
                            borderRadius:"6px 6px 0 0", padding:"7px 12px" }}>
                            {["Field","Original","Revised",""].map(h => (
                              <div key={h} style={{ fontSize:11, fontWeight:600, color:C.textSec,
                                textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</div>
                            ))}
                          </div>

                          {changedEntries.map(([key, { old: oldVal, new: newVal }], i) => {
                            const isCA   = CA_SENSITIVE_KEYS.has(key.split(".").slice(0,2).join("."));
                            const isLast = i === changedEntries.length - 1;
                            const existingQuery = clarifications.filter(c => c.fieldPath === key);
                            const hasOpenQuery  = existingQuery.some(c => c.status === "open");

                            return (
                              <div key={key}>
                                <div style={{
                                  display:"grid", gridTemplateColumns:"180px 1fr 1fr 120px",
                                  border:`1px solid ${C.border}`, borderTop:"none",
                                  borderRadius: isLast && queryOpen !== key ? "0 0 6px 6px" : 0,
                                  background: isCA ? "#fff7ed" : "#fff",
                                }}>
                                  {/* Field name */}
                                  <div style={{ padding:"10px 12px", borderRight:`1px solid ${C.border}`,
                                    display:"flex", flexDirection:"column", gap:3 }}>
                                    <span style={{ fontSize:12, fontWeight:600, color:C.textPri }}>
                                      {DIFF_FIELD_LABELS[key] || key}
                                    </span>
                                    {isCA && (
                                      <span style={{ fontSize:9, fontWeight:700, background:"#fff7ed",
                                        color:"#c2410c", padding:"1px 5px", borderRadius:3,
                                        border:"1px solid #fed7aa", alignSelf:"flex-start" }}>CA</span>
                                    )}
                                  </div>
                                  {/* Old */}
                                  <div style={{ padding:"10px 12px", borderRight:`1px solid ${C.border}`,
                                    fontSize:13, color:C.textDis, textDecoration:"line-through",
                                    display:"flex", alignItems:"center" }}>
                                    {formatDiffValue(key, oldVal)}
                                  </div>
                                  {/* New */}
                                  <div style={{ padding:"10px 12px", borderRight:`1px solid ${C.border}`,
                                    fontSize:13, fontWeight:600, color:"#166534",
                                    display:"flex", alignItems:"center", gap:5 }}>
                                    <i className="ti ti-arrow-right" style={{ fontSize:11, color:"#86efac", flexShrink:0 }} aria-hidden="true" />
                                    {formatDiffValue(key, newVal)}
                                  </div>
                                  {/* Query action */}
                                  <div style={{ padding:"8px 10px", display:"flex", alignItems:"center" }}>
                                    {hasOpenQuery ? (
                                      <span style={{ fontSize:11, color:"#d97706", fontWeight:500,
                                        display:"flex", alignItems:"center", gap:3 }}>
                                        <i className="ti ti-message-question" style={{ fontSize:12 }} aria-hidden="true" />
                                        Queried
                                      </span>
                                    ) : isActiveApprover ? (
                                      <button
                                        onClick={() => setQueryOpen(queryOpen === key ? null : key)}
                                        style={{ fontSize:11, color:C.midBlue, background:"none",
                                          border:`1px solid ${C.border}`, borderRadius:4,
                                          padding:"3px 8px", cursor:"pointer", fontFamily:"inherit",
                                          display:"flex", alignItems:"center", gap:3 }}>
                                        <i className="ti ti-message-plus" style={{ fontSize:11 }} aria-hidden="true" />
                                        Query
                                      </button>
                                    ) : null}
                                  </div>
                                </div>

                                {/* Inline query form */}
                                {queryOpen === key && (
                                  <div style={{
                                    border:`1px solid ${C.warning}`, borderTop:"none",
                                    borderRadius: isLast ? "0 0 6px 6px" : 0,
                                    background:"#fffbeb", padding:"12px 14px",
                                  }}>
                                    <div style={{ fontSize:12, fontWeight:600, color:"#92400e", marginBottom:8 }}>
                                      Query this change — {DIFF_FIELD_LABELS[key] || key}
                                    </div>
                                    <div style={{ marginBottom:8 }}>
                                      <select
                                        value={queryRecip}
                                        onChange={e => setQueryRecip(e.target.value)}
                                        style={{ width:"100%", height:32, border:`1px solid ${C.border}`,
                                          borderRadius:5, padding:"0 8px", fontSize:12,
                                          fontFamily:"inherit", marginBottom:6 }}>
                                        <option value="">Select recipient…</option>
                                        {clarificationRecipients.map(u => (
                                          <option key={u.uuid} value={u.uuid}>{u.name} ({ROLE_LABELS[u.role]})</option>
                                        ))}
                                      </select>
                                      <textarea
                                        value={queryDraft}
                                        onChange={e => setQueryDraft(e.target.value)}
                                        placeholder="Describe your query about this change…"
                                        rows={2}
                                        style={{ width:"100%", boxSizing:"border-box",
                                          border:`1px solid ${C.border}`, borderRadius:5,
                                          padding:"6px 8px", fontSize:12, fontFamily:"inherit",
                                          resize:"vertical" }}
                                      />
                                    </div>
                                    <div style={{ display:"flex", gap:6 }}>
                                      <button
                                        onClick={() => submitQuery(key)}
                                        disabled={!queryDraft.trim() || !queryRecip}
                                        style={{ fontSize:12, fontWeight:500,
                                          background: queryDraft.trim() && queryRecip ? C.navy : "#e2e8f0",
                                          color: queryDraft.trim() && queryRecip ? "#fff" : C.textDis,
                                          border:"none", borderRadius:5, padding:"0 14px", height:28,
                                          cursor: queryDraft.trim() && queryRecip ? "pointer" : "not-allowed",
                                          fontFamily:"inherit" }}>
                                        Send Query
                                      </button>
                                      <button onClick={() => { setQueryOpen(null); setQueryDraft(""); setQueryRecip(""); }}
                                        style={{ fontSize:12, background:"#fff", color:C.textSec,
                                          border:`1px solid ${C.border}`, borderRadius:5,
                                          padding:"0 12px", height:28, cursor:"pointer", fontFamily:"inherit" }}>
                                        Cancel
                                      </button>
                                    </div>
                                    {/* Existing queries on this field */}
                                    {existingQuery.length > 0 && (
                                      <div style={{ marginTop:10 }}>
                                        {existingQuery.map(cr => (
                                          <div key={cr.id} style={{ fontSize:11, color:"#92400e",
                                            background:"#fff", border:`1px solid #fde68a`,
                                            borderRadius:4, padding:"6px 8px", marginBottom:4 }}>
                                            <strong>{getUser(cr.askedBy)?.name}:</strong> {cr.question}
                                            {cr.reply && <div style={{ color:"#15803d", marginTop:3 }}>↳ {cr.reply}</div>}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>

                  </div>
                )}

                {/* ── Tab: Full Data Sheet — same read-only layout as normal approval ── */}
                {activeTab === "full" && (
                  <>
                    <ProjectIdentifiersBlock project={project} />
                    <div style={cardStyle}>
                      {secTitle("ti-ruler-2", "Floor Areas")}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 16px" }}>
                        {[
                          ["Site Area",              `${B.siteAreaSM||"—"} m² / ${B.siteAreaSF||"—"} ft²`,             "sectionB.siteArea"],
                          ["Gross Floor Area",       `${B.gfaSM||"—"} m² / ${B.gfaSF||"—"} ft²`,                      "sectionB.gfa"],
                          ["Domestic GFA",           `${B.domesticGfaSM||"—"} m² / ${B.domesticGfaSF||"—"} ft²`,      "sectionB.domGfa"],
                          ["Non-Domestic GFA",       `${B.nonDomesticGfaSM||"—"} m² / ${B.nonDomesticGfaSF||"—"} ft²`,"sectionB.nonDomGfa"],
                          ["Construction Floor Area",`${B.constructionFloorAreaSM||"—"} m² / ${B.constructionFloorAreaSF||"—"} ft²`,"sectionB.cfa",true],
                        ].map(([label,value,fp,req]) => (
                          <ROFieldInline key={fp} label={label} value={value} fieldPath={fp} req={req} />
                        ))}
                      </div>
                    </div>
                    <div style={cardStyle}>
                      {secTitle("ti-building","Nature, Units & Carpark")}
                      <div style={{ marginBottom:14 }}>
                        <ROField label="Nature of Project" fieldPath="sectionB.natureOfProject"
                          value={B.natureOfProject?.map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(", ")||"—"} />
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:14 }}>
                        <ROFieldInline label="No. of Blocks & Storeys" value={B.noOfBlocksStorey||"—"} fieldPath="sectionB.noOfBlocksStorey" />
                        <ROFieldInline label="BeamPlus Target" value={B.beamPlus?.target||"—"} fieldPath="sectionB.beamPlus.target" />
                        <ROFieldInline label="BeamPlus Actual"  value={B.beamPlus?.actual||"—"} fieldPath="sectionB.beamPlus.actual" />
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:14 }}>
                        {[["Tower","tower"],["Villa","villa"],["House","house"]].map(([l,k]) => (
                          <ROFieldInline key={k} label={`Units — ${l}`} value={B.residentialUnits?.[k]||"—"} fieldPath={`sectionB.residentialUnits.${k}`} />
                        ))}
                      </div>
                    </div>
                    <div style={cardStyle}>
                      {secTitle("ti-calendar","Key Dates")}
                      <div style={{ display:"grid", gridTemplateColumns:"170px 1fr 1fr", gap:8,
                        padding:"4px 0 8px", borderBottom:`1px solid ${C.border}`, marginBottom:2 }}>
                        {["Date","Target","Actual"].map(h=>(
                          <div key={h} style={{ fontSize:11, fontWeight:600, color:C.textSec,
                            textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</div>
                        ))}
                      </div>
                      {[
                        ["Commencement","commencement",true],
                        ["Site Formation Commencement","siteFormationCommencement"],
                        ["Cap Commencement","capCommencement"],
                        ["Occupation Permit","occupationPermit",true],
                        ["Phased OP","phasedOccupationPermit"],
                        ["Practical Completion","practicalCompletion",true],
                        ["Sectional Completion","sectionalCompletion"],
                        ["Consent to Assign","consentToAssign"],
                        ["Cert. of Compliance","certificateOfCompliance"],
                        ["Building Covenant","buildingCovenant"],
                      ].map(([label,key,req])=>(
                        <RODateRow key={key} label={label} dateKey={key} req={req} />
                      ))}
                    </div>
                    <div style={cardStyle}>
                      {secTitle("ti-users","Project Team & Consultants")}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:14 }}>
                        <ROFieldInline label="Developer"              value={B.developer||"—"}              fieldPath="sectionB.developer" />
                        <ROFieldInline label="CPM"                    value={B.cpm?.name||"—"}              fieldPath="sectionB.cpm.name" />
                        <ROFieldInline label="Main Contractor"        value={B.mainContractor||"—"}         fieldPath="sectionB.mainContractor" />
                        <ROFieldInline label="Design Architect"       value={B.designArchitect||"—"}        fieldPath="sectionB.designArchitect" />
                        <ROFieldInline label="Structural (BDRSE)"     value={B.rse?.name||"—"}              fieldPath="sectionB.rse" />
                        <ROFieldInline label="M&E Consultant"         value={B.meConsultant||"—"}           fieldPath="sectionB.meConsultant" />
                        <ROFieldInline label="Geotechnical (BDRGE)"   value={B.rge?.name||"—"}              fieldPath="sectionB.rge" />
                        <ROFieldInline label="Landscape Consultant"   value={B.landscapeConsultant||"—"}    fieldPath="sectionB.landscapeConsultant" />
                        <ROFieldInline label="Sustainability Consult." value={B.sustainabilityConsultant||"—"} fieldPath="sectionB.sustainability" />
                        <ROFieldInline label="QS Consultant"          value={B.qsConsultant||"—"}           fieldPath="sectionB.qsConsultant" />
                      </div>
                    </div>
                    <div style={cardStyle}>
                      {secTitle("ti-file-description","Contract Terms")}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                        <ROFieldInline label="Type of Contract" fieldPath="sectionC.typeOfContract"
                          value={C2.typeOfContract?.map(v=>({inhouse:"In-house",jv:"JV",tender:"Tender",lump_sum:"Lump Sum",others:"Others"}[v]||v)).join(", ")||"—"} />
                        <ROFieldInline label="Payment Term" fieldPath="sectionC.paymentTerm"
                          value={C2.paymentTerm?.map(v=>({monthly_progress:"Monthly Progress",scheduled:"Scheduled",architect_certificate:"Architect Certificate"}[v]||v)).join(", ")||"—"} />
                      </div>
                      {C2.remarks && <ROField label="Remarks" value={C2.remarks} fieldPath="sectionC.remarks" />}
                    </div>
                  </>
                )}

                {/* ── Approval action card — Changes Summary tab only ── */}
                {activeTab === "changes" && isActiveApprover && !approved && !returned && (
                  <div style={cardStyle}>
                    <div style={{ fontSize:15, fontWeight:600, color:C.textPri, marginBottom:14,
                      paddingBottom:10, borderBottom:`1px solid #f1f5f9`,
                      display:"flex", alignItems:"center", gap:8 }}>
                      <i className="ti ti-pen-check" style={{ color:C.navy, fontSize:16 }} aria-hidden="true" />
                      {ROLE_LABELS[role]} Decision
                    </div>
                    <button onClick={handleApprove} disabled={!canApprove}
                      style={{ display:"flex", alignItems:"center", gap:6,
                        background: canApprove ? C.navy : "#e2e8f0",
                        color: canApprove ? "#fff" : C.textDis,
                        border:"none", borderRadius:6, padding:"0 24px", height:40,
                        fontSize:14, fontWeight:600,
                        cursor: canApprove ? "pointer" : "not-allowed",
                        fontFamily:"inherit", marginBottom:16 }}>
                      <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
                      {role === "gm" ? "Approve Revision & Sign Off" : "Approve Revision"}
                    </button>
                    {!canApprove && openClarifications.length > 0 && (
                      <div style={{ fontSize:12, color:"#d97706", marginBottom:12 }}>
                        Resolve {openClarifications.length} open clarification{openClarifications.length>1?"s":""} before approving.
                      </div>
                    )}
                    {!showReturn ? (
                      <button onClick={() => setShowReturn(true)}
                        style={{ fontSize:12, color:C.textSec, background:"none", border:"none",
                          cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4,
                          textDecoration:"underline", paddingLeft:0 }}>
                        <i className="ti ti-arrow-back-up" style={{ fontSize:13 }} aria-hidden="true" />
                        Return for revision…
                      </button>
                    ) : (
                      <div style={{ background:"#fff8f8", border:"1px solid #fca5a5", borderRadius:6, padding:"14px 16px", marginTop:8 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#991b1b", marginBottom:10 }}>⚠ Return for Revision</div>
                        <div style={{ fontSize:12, color:C.textSec, marginBottom:8 }}>Select which stage to return the form to.</div>
                        <select value={returnStage} onChange={e => setReturnStage(e.target.value)}
                          style={{ width:"100%", height:34, border:`1px solid ${C.border}`, borderRadius:5,
                            padding:"0 8px", fontSize:13, fontFamily:"inherit", marginBottom:8 }}>
                          <option value="">Select stage…</option>
                          {(RETURN_OPTIONS[role]||[]).map(s => (
                            <option key={s} value={s}>{STAGE_LABEL[s]}</option>
                          ))}
                        </select>
                        <textarea value={returnNote} onChange={e => setReturnNote(e.target.value)}
                          placeholder="Reason for return (optional)"
                          rows={2}
                          style={{ width:"100%", boxSizing:"border-box", border:`1px solid ${C.border}`,
                            borderRadius:5, padding:"6px 8px", fontSize:12,
                            fontFamily:"inherit", resize:"vertical", marginBottom:8 }} />
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={handleReturn} disabled={!returnStage}
                            style={{ background: returnStage ? C.danger : "#e2e8f0",
                              color: returnStage ? "#fff" : C.textDis, border:"none", borderRadius:6,
                              padding:"0 16px", height:34, fontSize:13, fontWeight:500,
                              cursor: returnStage ? "pointer" : "not-allowed", fontFamily:"inherit" }}>
                            Confirm Return
                          </button>
                          <button onClick={() => { setShowReturn(false); setReturnStage(""); setReturnNote(""); }}
                            style={{ background:"#fff", color:C.textPri, border:`1px solid ${C.border}`,
                              borderRadius:6, padding:"0 14px", height:34, fontSize:13,
                              cursor:"pointer", fontFamily:"inherit" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })() : (
          <>

          {/* ── Section A: read-only always ── */}
          <ProjectIdentifiersBlock project={project} />

          {/* ── Section B: all read-only ── */}
          <div style={cardStyle}>
            {secTitle("ti-ruler-2", "Floor Areas")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
              {[
                ["Site Area", `${B.siteAreaSM||"—"} m² / ${B.siteAreaSF||"—"} ft²`, "sectionB.siteArea"],
                ["Gross Floor Area", `${B.gfaSM||"—"} m² / ${B.gfaSF||"—"} ft²`, "sectionB.gfa"],
                ["Domestic GFA", `${B.domesticGfaSM||"—"} m² / ${B.domesticGfaSF||"—"} ft²`, "sectionB.domesticGfa"],
                ["Non-Domestic GFA", `${B.nonDomesticGfaSM||"—"} m² / ${B.nonDomesticGfaSF||"—"} ft²`, "sectionB.nonDomesticGfa"],
                ["Construction Floor Area", `${B.constructionFloorAreaSM||"—"} m² / ${B.constructionFloorAreaSF||"—"} ft²`, "sectionB.constructionFloorArea", true],
              ].map(([label, value, fp, req]) => (
                <ROFieldInline key={fp} label={label} value={value} fieldPath={fp} req={req} />
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            {secTitle("ti-building", "Nature, Units & Carpark")}
            <div style={{ marginBottom: 14 }}>
              <ROField label="Nature of Project" fieldPath="sectionB.natureOfProject"
                value={B.natureOfProject?.map(n => n.charAt(0).toUpperCase()+n.slice(1)).join(", ")||"—"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 14 }}>
              <ROFieldInline label="No. of Blocks & Storeys" value={B.noOfBlocksStorey||"—"} fieldPath="sectionB.noOfBlocksStorey" />
              <ROFieldInline label="BeamPlus Target" value={B.beamPlus?.target||"—"} fieldPath="sectionB.beamPlus.target" />
              <ROFieldInline label="BeamPlus Actual" value={B.beamPlus?.actual||"—"} fieldPath="sectionB.beamPlus.actual" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 14 }}>
              {[["Tower","tower"],["Villa","villa"],["House","house"]].map(([l,k]) => (
                <ROFieldInline key={k} label={`Residential Units — ${l}`} value={B.residentialUnits?.[k]||"—"} fieldPath={`sectionB.residentialUnits.${k}`} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
              {[
                ["Residential Carpark","residential"],["Commercial Carpark","commercial"],
                ["Visitor Carpark","visitor"],["Motorcycle","motorcycle"],
                ["Bicycle","bicycle"],["Loading / Unloading","loadingUnloading"],
              ].map(([l,k]) => (
                <ROFieldInline key={k} label={l} value={B.carpark?.[k]||"—"} fieldPath={`sectionB.carpark.${k}`} />
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            {secTitle("ti-calendar", "Key Dates")}
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", gap: 8,
              padding: "4px 0 8px", borderBottom: `1px solid ${C.border}`, marginBottom: 2 }}>
              {["Milestone","Target","Actual"].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 600, color: C.textSec,
                  textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
              ))}
            </div>
            <RODateRow label="Commencement" dateKey="commencement" req />
            <RODateRow label="Site Formation" dateKey="siteFormationCommencement" />
            <RODateRow label="Cap Commencement" dateKey="capCommencement" />
            <RODateRow label="Occupation Permit" dateKey="occupationPermit" req />
            <RODateRow label="Phased OP" dateKey="phasedOccupationPermit" req />
            <RODateRow label="Practical Completion" dateKey="practicalCompletion" req />
            <RODateRow label="Sectional Completion" dateKey="sectionalCompletion" req />
            <RODateRow label="Consent to Assign (CTOA)" dateKey="consentToAssign" req />
            <RODateRow label="Certificate of Compliance" dateKey="certificateOfCompliance" req />
            <RODateRow label="Building Covenant" dateKey="buildingCovenant" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
              <ROFieldInline label="Defect Liability Period" fieldPath="sectionB.defectLiabilityPeriod"
                value={B.defectLiabilityPeriod?.replace("_"," ").replace("months","Months").replace("years","Years")||"—"} />
              <ROFieldInline label="Project Phasing" fieldPath="sectionB.projectPhasing" value={B.projectPhasing||"—"} req />
            </div>
          </div>

          <div style={cardStyle}>
            {secTitle("ti-building-estate", "Developer, Consultants & Contract")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <ROFieldInline label="Developer" value={B.developer||"—"} fieldPath="sectionB.developer" req />
              <ROFieldInline label="Main Contractor" value={B.mainContractor||"—"} fieldPath="sectionB.mainContractor" req />
              <ROFieldInline label="Contractor Licence" value={B.contractorLicence||"—"} fieldPath="sectionB.contractorLicence" />
              <ROFieldInline label="Estate Management" value={B.estateManagement||"—"} fieldPath="sectionB.estateManagement" />
              <ROFieldInline label="Design Architect" value={B.designArchitect||"—"} fieldPath="sectionB.designArchitect" />
              <ROFieldInline label="M&E Consultant" value={B.meConsultant||"—"} fieldPath="sectionB.meConsultant" />
              {[
                ["Technical Director", B.technicalDirector, "technicalDirector"],
                ["Authorised Signatory", B.authorisedSignatory, "authorisedSignatory"],
                ["Architecture AP", B.architectureAP, "architectureAP"],
                ["Structural Consultant (RSE)", B.rse, "rse"],
                ["Geotechnical Consultant (RGE)", B.rge, "rge"],
              ].map(([label, obj, key]) => (
                <ROFieldInline key={key} label={label}
                  value={obj?.name ? `${obj.name} (${obj.bdCode})` : "—"}
                  fieldPath={`sectionB.${key}`} />
              ))}
            </div>
            <div style={{ borderTop: `1px solid #f1f5f9`, paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 10 }}>Cost Control Leaders</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <ROFieldInline label="Accounting Manager" value={B.costControlLeaders?.accountingManager||"—"} fieldPath="sectionB.costControlLeaders.accountingManager" req />
                <ROFieldInline label="QS Manager" value={B.costControlLeaders?.qsManager||"—"} fieldPath="sectionB.costControlLeaders.qsManager" req />
                <ROFieldInline label="Contracts Manager" value={B.costControlLeaders?.contractsManager||"—"} fieldPath="sectionB.costControlLeaders.contractsManager" req />
              </div>
            </div>
          </div>

          {/* ── Section C: read-only ── */}
          <div style={cardStyle}>
            {secTitle("ti-clipboard-check", "Contract Terms")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <ROFieldInline label="Type of Contract" fieldPath="sectionC.typeOfContract"
                value={C2.typeOfContract?.map(v => ({inhouse:"In-house",jv:"JV",tender:"Tender",lump_sum:"Lump Sum",others:"Others"}[v]||v)).join(", ")||"—"} req />
              <ROFieldInline label="Payment Term" fieldPath="sectionC.paymentTerm"
                value={C2.paymentTerm?.map(v => ({monthly_progress:"Monthly Progress",scheduled:"Scheduled",architect_certificate:"Architect Certificate"}[v]||v)).join(", ")||"—"} req />
            </div>
            {C2.remarks && <ROField label="Remarks" value={C2.remarks} fieldPath="sectionC.remarks" />}
          </div>

          {/* Cost Account's finance code draft — read-only, QS Manager only */}
          {role === "qs_manager" && project.sectionD && (project.sectionD.financeProjectCode || (project.sectionD.subCodes||[]).some(s => s.subCode || s.description)) && (
            <div style={{ ...cardStyle, borderLeft: "4px solid #16a34a" }}>
              {secTitle("ti-report-money", "Cost Account — Finance Code Draft")}
              <div style={{ fontSize: 11, color: C.textDis, marginTop: -10, marginBottom: 14 }}>
                Drafted in advance by Cost Account, ahead of GM approval. Read-only — not yet final.
              </div>
              <div style={{ marginBottom: 14 }}>
                {fieldLabel("Finance Project Code")}
                {roVal(project.sectionD.financeProjectCode)}
              </div>
              {(project.sectionD.subCodes||[]).filter(s => s.subCode || s.description).length > 0 && (
                <div>
                  {fieldLabel("Finance Sub-Project Codes")}
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#f8fafc",
                      borderBottom: `1px solid ${C.border}`, padding: "6px 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.04em" }}>Sub-Project Code</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</div>
                    </div>
                    {project.sectionD.subCodes.filter(s => s.subCode || s.description).map((row, idx, arr) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                        borderBottom: idx < arr.length-1 ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ padding: "7px 12px", borderRight: `1px solid ${C.border}`, fontSize: 13, color: C.textPri }}>{row.subCode||"—"}</div>
                        <div style={{ padding: "7px 12px", fontSize: 13, color: C.textSec }}>{row.description||"—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Review Activity Summary (resolved clarifications) ── */}
          {clarifications.filter(c => c.status === "resolved").length > 0 && (
            <div style={cardStyle}>
              {secTitle("ti-history", "Review Activity — Resolved Clarifications")}
              {clarifications.filter(c => c.status === "resolved").map(cr => (
                <div key={cr.id} style={{ padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <i className="ti ti-circle-check" style={{ fontSize: 14, color: C.success }} aria-hidden="true" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textPri }}>{cr.fieldLabel}</span>
                    <span style={{ fontSize: 11, color: C.textSec }}>· asked by {getUser(cr.askedBy)?.name} → {getUser(cr.recipientUUID)?.name}</span>
                  </div>
                  <div style={{ marginLeft: 20, fontSize: 12, color: C.textSec, marginBottom: 4 }}>Q: {cr.question}</div>
                  {cr.reply && <div style={{ marginLeft: 20, fontSize: 12, color: C.textPri, marginBottom: cr.fieldUpdated ? 4 : 0 }}>A: {cr.reply}</div>}
                  {cr.fieldUpdated && (
                    <div style={{ marginLeft: 20, marginTop: 4, padding: "6px 10px",
                      background: "#f0fdf4", border: `1px solid #86efac`, borderRadius: 4, fontSize: 12 }}>
                      <div style={{ fontSize: 11, color: C.textSec, marginBottom: 4, fontWeight: 500 }}>
                        Field updated by {getUser(cr.recipientUUID)?.name}
                      </div>
                      <span style={{ textDecoration: "line-through", color: C.textDis, marginRight: 8 }}>{cr.oldValue || "—"}</span>
                      <span style={{ color: "#15803d", fontWeight: 500 }}>→ {cr.newValue || "—"}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Approval action card ── */}
          {isActiveApprover && !approved && !returned && (
            <div style={cardStyle}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textPri, marginBottom: 14,
                paddingBottom: 10, borderBottom: `1px solid #f1f5f9`,
                display: "flex", alignItems: "center", gap: 8 }}>
                <i className="ti ti-pen-check" style={{ color: C.navy, fontSize: 16 }} aria-hidden="true" />
                {ROLE_LABELS[role]} Decision
              </div>

              {/* QS TL review notice */}
              {role === "qs_team_leader" && (
                <div style={{ display:"flex", alignItems:"flex-start", gap:8,
                  background:"#f0f7ff", border:"1px solid #bfdbfe",
                  borderRadius:6, padding:"10px 12px", marginBottom:16, fontSize:12 }}>
                  <i className="ti ti-info-circle" style={{ fontSize:15, color:C.midBlue, flexShrink:0, marginTop:1 }} aria-hidden="true" />
                  <div style={{ color:"#1e40af" }}>
                    <strong>Review mode</strong> — read the data sheet below carefully.
                    Approve to pass to QS Manager, or return to Engineer if changes are needed.
                    Clarification requests are not available at this stage.
                    <div style={{ marginTop:6, fontSize:10, color:"#64748b", fontFamily:"monospace" }}>
                      debug: stage={project.stage} role={role} isActive={String(isActiveApprover)} canApprove={String(canApprove)} openClar={openClarifications.length} approved={String(approved)}
                    </div>
                  </div>
                </div>
              )}

              {/* Approve */}
              <button onClick={handleApprove} disabled={!canApprove}
                style={{ display: "flex", alignItems: "center", gap: 6,
                  background: canApprove ? C.navy : "#e2e8f0",
                  color: canApprove ? "#fff" : C.textDis,
                  border: "none", borderRadius: 6, padding: "0 24px", height: 40,
                  fontSize: 14, fontWeight: 600,
                  cursor: canApprove ? "pointer" : "not-allowed", fontFamily: "inherit",
                  marginBottom: 16 }}>
                <i className="ti ti-circle-check" style={{ fontSize: 16 }} aria-hidden="true" />
                {role === "gm"
                  ? (project.status === "revision" ? "Approve Revision & Sign Off" : "Approve & Sign Off")
                  : role === "qs_team_leader"
                    ? (project.status === "revision" ? "Approve Revision" : "Approve — Pass to QS Manager")
                    : (project.status === "revision" ? "Approve Revision" : "Approve")}
              </button>
              {!canApprove && openClarifications.length > 0 && (
                <div style={{ fontSize: 12, color: "#d97706", marginBottom: 12 }}>
                  Resolve {openClarifications.length} open clarification{openClarifications.length>1?"s":""} before approving.
                </div>
              )}

              {/* Return for revision — de-emphasised, behind disclosure */}
              {!showReturn ? (
                <button onClick={() => setShowReturn(true)}
                  style={{ fontSize: 12, color: C.textSec, background: "none", border: "none",
                    cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
                    textDecoration: "underline", paddingLeft: 0 }}>
                  <i className="ti ti-arrow-back-up" style={{ fontSize: 13 }} aria-hidden="true" />
                  {role === "qs_team_leader" ? "Return to Engineer…" : "Return for revision…"}
                </button>
              ) : (
                <div style={{ background: "#fff8f8", border: "1px solid #fca5a5", borderRadius: 6, padding: "14px 16px", marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#991b1b", marginBottom: 10 }}>
                    ⚠ Return for Revision
                  </div>
                  <div style={{ fontSize: 12, color: C.textSec, marginBottom: 10 }}>
                    Select which stage to return the form to. That person's edit access will reopen.
                  </div>
                  <select value={returnStage} onChange={e => setReturnStage(e.target.value)}
                    style={{ height: 34, border: `1px solid ${C.border}`, borderRadius: 6,
                      padding: "0 10px", fontSize: 13, fontFamily: "inherit", background: "#fff",
                      width: "100%", marginBottom: 10, cursor: "pointer" }}>
                    <option value="">— Select stage to return to —</option>
                    {(RETURN_OPTIONS[role] || []).map(s => (
                      <option key={s} value={s}>{STAGE_LABEL[s]}</option>
                    ))}
                  </select>
                  <textarea value={returnNote} onChange={e => setReturnNote(e.target.value)}
                    placeholder="Note for the recipient (optional)…" rows={2}
                    style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 6,
                      padding: "6px 10px", fontSize: 12, fontFamily: "inherit", resize: "none",
                      boxSizing: "border-box", marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleReturn} disabled={!returnStage}
                      style={{ background: returnStage ? C.danger : "#e2e8f0",
                        color: returnStage ? "#fff" : C.textDis, border: "none", borderRadius: 6,
                        padding: "0 16px", height: 34, fontSize: 13, fontWeight: 500,
                        cursor: returnStage ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                      Confirm Return
                    </button>
                    <button onClick={() => { setShowReturn(false); setReturnStage(""); setReturnNote(""); }}
                      style={{ background: "#fff", color: C.textPri, border: `1px solid ${C.border}`,
                        borderRadius: 6, padding: "0 14px", height: 34, fontSize: 13,
                        cursor: "pointer", fontFamily: "inherit" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          </>)}
        </div>

        {/* Right sidebar */}
        <div style={{ position: "sticky", top: 0 }}>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textSec, textTransform: "uppercase",
              letterSpacing: "0.04em", marginBottom: 12 }}>Project Summary</div>
            {[
              { label: "Site Code",   value: project.siteCode, mono: true },
              { label: "Short Name",  value: project.shortName },
              { label: "PIC",         value: getUser(project.assignedRoles?.pic)?.name || "—" },
              { label: "QS Manager",  value: getUser(project.assignedRoles?.qsManager)?.name || "—" },
              { label: "SIC",         value: getUser(project.assignedRoles?.sic)?.name || "—" },
              { label: "Engineer",    value: getUser(project.assignedRoles?.engineer)?.name || "—" },
              { label: "QS TL",       value: getUser(project.assignedRoles?.qsTeamLeader)?.name || "—" },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ paddingBottom: 6, marginBottom: 6, borderBottom: "1px solid #f8fafc" }}>
                <div style={{ fontSize: 11, color: C.textDis, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 13, color: C.textPri, fontWeight: 500,
                  fontFamily: mono ? "monospace" : "inherit" }}>{value || "—"}</div>
              </div>
            ))}
            {/* Edit Assignments — visible all, active PIC/QSM only */}
            {onEditAssignments && (() => {
              const canEdit = currentUser.role === "pic" || currentUser.role === "qs_manager"
                || currentUser.uuid === project.assignedRoles?.pic
                || currentUser.uuid === project.assignedRoles?.qsManager;
              return (
                <button
                  onClick={canEdit ? onEditAssignments : undefined}
                  title={canEdit ? "Edit team assignments" : "Only PIC or QS Manager can edit assignments"}
                  style={{ width:"100%", marginBottom:8, display:"flex", alignItems:"center", gap:6,
                    justifyContent:"center", height:30, borderRadius:6, fontSize:12, fontWeight:500,
                    background: canEdit ? "#eff6ff" : "#f8fafc",
                    color: canEdit ? C.midBlue : C.textDis,
                    border: `1px solid ${canEdit ? "#bfdbfe" : C.border}`,
                    cursor: canEdit ? "pointer" : "default",
                    fontFamily:"inherit" }}>
                  <i className="ti ti-pencil" style={{ fontSize:12 }} aria-hidden="true" />
                  Edit Assignments
                  {!canEdit && <i className="ti ti-lock" style={{ fontSize:11, marginLeft:"auto", opacity:0.5 }} aria-hidden="true" />}
                </button>
              );
            })()}
            {/* Open clarifications count */}
            {openClarifications.length > 0 && (
              <div style={{ margin: "8px 0", padding: "6px 10px", background: "#fffbeb",
                border: "1px solid #d97706", borderRadius: 6, fontSize: 11, color: "#92400e" }}>
                <i className="ti ti-message-question" style={{ fontSize: 12 }} aria-hidden="true" />
                &nbsp;{openClarifications.length} open clarification{openClarifications.length > 1 ? "s" : ""}
              </div>
            )}
            <Stepper currentStage={approved ? {qs_manager:"sic",sic:"pic",pic:"gm",gm:"cost_account"}[role]||role : project.stage} />
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Screen 8: Revision Initiation ────────────────────────────────────────

// Fields that affect Cost Account — trigger CA suspension if declared in revision.
// PIC/SIC are role assignments, not Section B text fields.
// Main Contractor, Type of Contract, Payment Term are LOCKED only after IT setup
// is complete (stage === "complete"). Before that they carry a COST ACCOUNT warning
// but remain selectable.
const CA_SENSITIVE_KEYS = new Set([
  "role.pic",
  "role.sic",
  "sectionB.mainContractor",
  "sectionC.typeOfContract",
  "sectionC.paymentTerm",
]);

// These keys are locked ONLY when project.stage === "complete" (IT setup done).
// Before that they are selectable with a COST ACCOUNT warning.
const LOCKED_AFTER_IT_COMPLETE_KEYS = new Set([
  "sectionB.mainContractor",
  "sectionC.typeOfContract",
  "sectionC.paymentTerm",
]);

// Fields eligible for revision — grouped by subsection, matching Section B/C
const REVISION_FIELD_GROUPS = [
  {
    // Role assignments live outside Section B/C — top of list for prominence
    group: "Role Assignments",
    note: "These are personnel role assignments, not data fields. A change here requires re-running the delegation step.",
    fields: [
      { key: "role.pic", label: "PIC Assignment (Project in Charge)", costAccount: true },
      { key: "role.sic", label: "SIC Assignment (Site in Charge)",    costAccount: true },
    ],
  },
  {
    group: "Site & Areas",
    fields: [
      { key: "sectionB.siteArea",               label: "Site Area" },
      { key: "sectionB.gfa",                    label: "Gross Floor Area (GFA)" },
      { key: "sectionB.domesticGfa",            label: "Domestic GFA" },
      { key: "sectionB.nonDomesticGfa",         label: "Non-Domestic GFA" },
      { key: "sectionB.constructionFloorArea",  label: "Construction Floor Area" },
    ],
  },
  {
    group: "Project Description",
    fields: [
      { key: "sectionB.natureOfProject",        label: "Nature of Project" },
      { key: "sectionB.noOfBlocksStorey",       label: "No. of Blocks & Storeys" },
      { key: "sectionB.residentialUnits",       label: "Residential Units" },
      { key: "sectionB.carpark",                label: "Carpark Numbers" },
      { key: "sectionB.projectPhasing",         label: "Project Phasing" },
      { key: "sectionB.defectLiabilityPeriod",  label: "Defect Liability Period" },
    ],
  },
  {
    group: "Key Dates",
    fields: [
      { key: "sectionB.dates.commencement",              label: "Commencement Date" },
      { key: "sectionB.dates.siteFormationCommencement", label: "Site Formation Commencement" },
      { key: "sectionB.dates.capCommencement",           label: "Cap Commencement Date" },
      { key: "sectionB.dates.occupationPermit",          label: "Occupation Permit (OP) Date" },
      { key: "sectionB.dates.phasedOccupationPermit",    label: "Phased OP Date(s)" },
      { key: "sectionB.dates.practicalCompletion",       label: "Practical Completion Date" },
      { key: "sectionB.dates.sectionalCompletion",       label: "Sectional Completion Date(s)" },
      { key: "sectionB.dates.consentToAssign",           label: "Consent to Assign (CTOA)" },
      { key: "sectionB.dates.certificateOfCompliance",   label: "Certificate of Compliance" },
      { key: "sectionB.dates.buildingCovenant",          label: "Building Covenant Date" },
    ],
  },
  {
    group: "Ratings & Sustainability",
    fields: [
      { key: "sectionB.beamPlus",               label: "BeamPlus Rating (Target/Actual)" },
    ],
  },
  {
    group: "Project Team",
    fields: [
      { key: "sectionB.developer",              label: "Name of Developer" },
      { key: "sectionB.cpm",                    label: "Client Project Manager (CPM)" },
      { key: "sectionB.technicalDirector",      label: "Technical Director & Auth. Signatory (BDTD)" },
      { key: "sectionB.authorisedSignatory",    label: "Authorised Signatory (BDAS)" },
      { key: "sectionB.designArchitect",        label: "Design Architect" },
      { key: "sectionB.architectureAP",         label: "Architecture, AP (BDAP)" },
      { key: "sectionB.rse",                    label: "Structural Consultant (BDRSE)" },
      { key: "sectionB.meConsultant",           label: "M&E Consultant" },
      { key: "sectionB.rge",                    label: "Geotechnical Consultant (BDRGE)" },
      { key: "sectionB.landscapeConsultant",    label: "Landscape Consultant" },
      { key: "sectionB.interiorDesigner",       label: "Interior Designer/Consultant" },
      { key: "sectionB.sustainabilityConsultant", label: "Sustainability / BeamPlus Consultant" },
      { key: "sectionB.qsConsultant",           label: "Quantity Surveying Consultant" },
      { key: "sectionB.otherConsultants",       label: "Other Consultant(s)" },
      { key: "sectionB.estateManagement",       label: "Estate Management" },
    ],
  },
  {
    group: "Main Contractor",
    fields: [
      { key: "sectionB.mainContractor",         label: "Main Contractor",          costAccount: true },
      { key: "sectionB.contractorLicence",      label: "Contractor Licence No." },
      { key: "sectionB.costControlLeaders.accountingManager", label: "Cost Control Leader (Accounting Manager)" },
      { key: "sectionB.costControlLeaders.qsManager",         label: "Cost Control Leader (QS Manager)" },
      { key: "sectionB.costControlLeaders.contractsManager",  label: "Cost Control Leader (Contracts Manager)" },
    ],
  },
  {
    group: "Contract (Section C)",
    fields: [
      { key: "sectionC.typeOfContract",   label: "Type of Contract",  costAccount: true },
      { key: "sectionC.paymentTerm",      label: "Payment Term",      costAccount: true },
      { key: "sectionC.remarks",          label: "Contract Remarks" },
    ],
  },
];

function RevisionInitiation({ currentUser, project, onBack, onRevisionStarted }) {
  const eligibleRoles = ["engineer", "sic", "qs_team_leader"];
  const canInitiate   = eligibleRoles.includes(currentUser.role) && project.status === "approved";

  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = confirmed;

  const stageMap = { engineer:"engineer", sic:"sic", qs_team_leader:"qs_team_leader" };
  const returnStage = stageMap[currentUser.role] || "engineer";

  function handleInitiate() {
    const newRevision = {
      revisionNo: (project.revisions || []).length + 1,
      triggeredBy: currentUser.uuid,
      triggeredAt: new Date().toISOString(),
      reason: "", // filled in by engineer on submit
      hasCASensitiveChange: false,
      status: "in_progress",
      snapshot: {
        sectionB: JSON.parse(JSON.stringify(project.sectionB || {})),
        sectionC: JSON.parse(JSON.stringify(project.sectionC || {})),
        assignedRoles: { ...(project.assignedRoles || {}) },
      },
      changedFields: {},
      approvalHistory: [],
    };
    const updated = {
      ...project,
      stage: returnStage,
      status: "revision",
      revisions: [...(project.revisions || []), newRevision],
      updatedAt: new Date().toISOString(),
    };
    setSubmitted(true);
    onRevisionStarted(updated);
  }

  const loc = getLoc(project.locationUUID);
  const cardSt = {
    background:"#fff", border:`1px solid ${C.border}`,
    borderRadius:8, padding:24, marginBottom:16, overflow:"visible",
  };

  if (!canInitiate) {
    return (
      <div style={{ padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSec, marginBottom:16 }}>
          <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>All Projects</a>
          <span style={{ color:C.textDis }}>›</span>
          <span>{project.siteCode}</span>
          <span style={{ color:C.textDis }}>›</span>
          <span>Initiate Revision</span>
        </div>
        <div style={{ ...cardSt, textAlign:"center", padding:48 }}>
          <i className="ti ti-lock" style={{ fontSize:32, color:C.textDis, display:"block", marginBottom:12 }} aria-hidden="true" />
          <div style={{ fontSize:15, fontWeight:600, color:C.textPri, marginBottom:8 }}>Access Restricted</div>
          <div style={{ fontSize:13, color:C.textSec }}>
            Only an Engineer, SIC, or QS Team Leader can initiate a revision, and only on a fully approved project.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:24 }}>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSec, marginBottom:16 }}>
        <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>All Projects</a>
        <span style={{ color:C.textDis }}>›</span>
        <span>{project.siteCode}</span>
        <span style={{ color:C.textDis }}>›</span>
        <span>Initiate Revision</span>
      </div>

      {/* Warning banner */}
      <div style={{ display:"flex", gap:12, background:"#fffbeb",
        border:`1px solid #d97706`, borderRadius:8,
        padding:"14px 18px", marginBottom:20 }}>
        <i className="ti ti-alert-triangle" style={{ fontSize:20, color:C.warning, flexShrink:0, marginTop:2 }} aria-hidden="true" />
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:"#92400e", marginBottom:4 }}>
            Initiating a revision restarts the full approval chain
          </div>
          <div style={{ fontSize:12, color:"#78350f", lineHeight:1.6 }}>
            All changes must be re-approved by the complete chain — Engineer → QS Team Leader → QS Manager → SIC → PIC → GM.
            If Cost Account-sensitive fields are changed, finance code entry will be suspended until GM re-approves.
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
        <div>

          {/* Confirmation checkbox */}
          <div style={{
            ...cardSt,
            border:`1px solid ${confirmed ? C.border : "#fca5a5"}`,
            background: confirmed ? "#fff" : "#fff5f5",
          }}>
            <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer" }}>
              <input type="checkbox" checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                style={{ marginTop:2, cursor:"pointer", accentColor:C.navy, flexShrink:0, width:16, height:16 }} />
              <span style={{ fontSize:13, color:C.textPri, lineHeight:1.6 }}>
                I understand that initiating this revision will <strong>restart the complete approval chain</strong> from my stage and affect downstream contracting work until GM re-approves.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={handleInitiate} disabled={!canSubmit || submitted}
              style={{ display:"flex", alignItems:"center", gap:8,
                background: canSubmit && !submitted ? C.navy : "#94a3b8",
                color:"#fff", border:"none", borderRadius:6,
                padding:"0 28px", height:42, fontSize:14, fontWeight:600,
                cursor: canSubmit && !submitted ? "pointer" : "not-allowed",
                fontFamily:"inherit" }}>
              <i className="ti ti-refresh" style={{ fontSize:16 }} aria-hidden="true" />
              {submitted ? "Revision Initiated" : "Initiate Revision"}
            </button>
            <button onClick={onBack}
              style={{ background:"#fff", color:C.textPri, border:`1px solid ${C.border}`,
                borderRadius:6, padding:"0 16px", height:42,
                fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
              Cancel
            </button>
            {!canSubmit && !submitted && (
              <span style={{ fontSize:12, color:C.textSec }}>
                Please confirm to proceed.
              </span>
            )}
          </div>

        </div>

        {/* Right sidebar */}
        <div style={{ position:"sticky", top:24 }}>
          <div style={{ ...cardSt, marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec,
              textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:12 }}>
              Project
            </div>
            {[
              { label:"Site Code",    value:project.siteCode, mono:true },
              { label:"Short Name",   value:project.shortName },
              { label:"Lot Ref.",     value:loc ? locPrimaryLabel(loc) : "—" },
              { label:"District",     value:loc?.district || "—" },
              { label:"Current Stage",value:STAGE_LABEL[project.stage] },
              { label:"PIC",          value:getUser(project.assignedRoles?.pic)?.name || "—" },
              { label:"SIC",          value:getUser(project.assignedRoles?.sic)?.name || "—" },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ paddingBottom:6, marginBottom:6, borderBottom:"1px solid #f8fafc" }}>
                <div style={{ fontSize:11, color:C.textDis, fontWeight:500 }}>{label}</div>
                <div style={{ fontSize:13, color:C.textPri, fontWeight:500,
                  fontFamily:mono?"'SF Mono',Consolas,monospace":"inherit" }}>{value||"—"}</div>
              </div>
            ))}
            <div style={{ marginTop:10, padding:"8px 10px", background:"#f0fdf4",
              border:"1px solid #86efac", borderRadius:6 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#166534", marginBottom:2 }}>
                <i className="ti ti-circle-check" style={{ fontSize:12 }} aria-hidden="true" /> GM Approved
              </div>
              <div style={{ fontSize:11, color:"#15803d" }}>Revision will restart the full approval chain</div>
            </div>
            {(project.revisions||[]).length > 0 && (
              <div style={{ marginTop:8, padding:"8px 10px", background:"#fef9c3",
                border:"1px solid #fde68a", borderRadius:6 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#92400e" }}>
                  {project.revisions.length} previous revision{project.revisions.length > 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>

          <div style={{ ...cardSt, background:"#fef9c3", border:"1px solid #fde68a" }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#92400e", marginBottom:8 }}>
              <i className="ti ti-clock" style={{ fontSize:13 }} aria-hidden="true" /> Urgency note
            </div>
            <div style={{ fontSize:11, color:"#713f12", lineHeight:1.6 }}>
              The Oracle project code is required before contracting teams can proceed. Initiate only when changes are confirmed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 6: Cost Account ───────────────────────────────────────────────




function CostAccountView({ currentUser, project, onBack, onUpdated, onInitiateRevision }) {
  const isCA = currentUser.role === "cost_account";
  const activeRevision = (project.revisions || []).find(r => r.status === "in_progress");
  // Revision blocks CA only if a Cost Account-sensitive field was declared
  const revisionBlocksCA = project.status === "revision" && activeRevision && activeRevision.hasCASensitiveChange;
  const revisionInProgress = project.status === "revision";
  const isActive = project.stage === "cost_account" && !revisionBlocksCA;
  const isPreApproval = STAGE_ORDER.indexOf(project.stage) < STAGE_ORDER.indexOf("cost_account") && !revisionInProgress;
  const isHandedToIT = project.stage === "it" || project.stage === "complete";
  const canEdit   = isCA && (isPreApproval || isActive);
  const canSubmit = isCA && isActive;

  // Elapsed days since revision triggered — for urgency colouring
  const elapsedDays = activeRevision
    ? Math.floor((Date.now() - new Date(activeRevision.triggeredAt).getTime()) / 86400000)
    : 0;
  const elapsedColor = elapsedDays >= 14 ? C.danger : elapsedDays >= 7 ? C.warning : C.textSec;
  const triggeredByUser = activeRevision ? getUser(activeRevision.triggeredBy) : null;

  const existing = project.sectionD || {};

  const [financeCode, setFinanceCode] = useState(existing.financeProjectCode || "");
  const [subCodes, setSubCodes] = useState(
    existing.subCodes && existing.subCodes.length > 0
      ? existing.subCodes
      : [{ id: Date.now(), subCode: "", description: "" }]
  );
  const [submitted, setSubmitted] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState(null);

  const B  = project.sectionB || {};
  const C2 = project.sectionC || {};
  const A  = project.sectionA || project;

  function addRow() {
    setSubCodes(prev => [...prev, { id: Date.now(), subCode: "", description: "" }]);
  }
  function removeRow(id) {
    setSubCodes(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  }
  function updateRow(id, field, value) {
    setSubCodes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  function handleSaveDraft() {
    const updated = {
      ...project,
      sectionD: { financeProjectCode: financeCode.trim(), subCodes },
      updatedAt: new Date().toISOString(),
    };
    onUpdated(updated);
    setDraftSavedAt(new Date());
  }

  function handleSubmit() {
    if (!financeCode.trim()) { alert("Finance Project Code is required."); return; }
    const updated = {
      ...project,
      stage: "it",
      sectionD: { financeProjectCode: financeCode.trim(), subCodes },
      postApprovalTasks: { ...(project.postApprovalTasks || {}), financeCodesStatus: "assigned" },
      approvalHistory: [...(project.approvalHistory || []), {
        stage: "cost_account", action: "submitted",
        userUUID: currentUser.uuid,
        timestamp: new Date().toISOString(),
        note: "",
      }],
      updatedAt: new Date().toISOString(),
    };
    setSubmitted(true);
    onUpdated(updated);
  }

  const cardSt = {
    background: "#fff", border: "1px solid " + C.border,
    borderRadius: 8, padding: 24, marginBottom: 16,
  };
  const secTit = (icon, text) => (
    <div style={{ fontSize: 15, fontWeight: 600, color: C.textPri, marginBottom: 16,
      paddingBottom: 10, borderBottom: "1px solid #f1f5f9",
      display: "flex", alignItems: "center", gap: 8 }}>
      <i className={"ti " + icon} style={{ color: C.navy, fontSize: 16 }} aria-hidden="true" />
      {text}
    </div>
  );
  const fLabel = (text, req) => (
    <label style={{ fontSize: 12, fontWeight: 500, color: C.textSec, marginBottom: 6, display: "block" }}>
      {req && <span style={{ color: C.danger, marginRight: 2 }}>*</span>}{text}
    </label>
  );
  const roValCA = (v) => (
    <div style={{ height: 36, border: "1px solid " + C.border, borderRadius: 6,
      padding: "0 10px", fontSize: 13, color: C.textSec, background: "#f8fafc",
      display: "flex", alignItems: "center" }}>
      {v || <span style={{ color: C.textDis, fontStyle: "italic" }}>—</span>}
    </div>
  );
  const inSt = {
    height: 36, border: "1px solid " + C.border, borderRadius: 6,
    padding: "0 10px", fontSize: 13, color: C.textPri,
    fontFamily: "inherit", background: "#fff", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb + Initiate Revision button */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSec, marginBottom:16 }}>
        <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>All Projects</a>
        <span style={{ color:C.textDis }}>›</span>
        <span>{project.siteCode}</span>
        <span style={{ color:C.textDis }}>›</span>
        <span>Finance Code Assignment</span>
        {/* Initiate Revision — visible to eligible roles on approved project */}
        {project.status === "approved" && ["engineer","sic","qs_team_leader"].includes(currentUser.role) && onInitiateRevision && (
          <button
            onClick={onInitiateRevision}
            style={{
              marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
              background:"#fff", color:C.warning, border:`1px solid ${C.warning}`,
              borderRadius:6, padding:"0 14px", height:32, fontSize:12,
              fontWeight:500, cursor:"pointer", fontFamily:"inherit",
            }}
          >
            <i className="ti ti-refresh" style={{ fontSize:13 }} aria-hidden="true" />
            Initiate Revision
          </button>
        )}
      </div>

      {/* Revision-BLOCKED banner — only when a CA-sensitive field is declared */}
      {revisionBlocksCA && (
        <div style={{
          border:`1px solid #d97706`, borderRadius:8,
          overflow:"hidden", marginBottom:16,
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            background:"#fffbeb", padding:"12px 16px",
            borderBottom:`1px solid #fde68a`,
          }}>
            <i className="ti ti-lock" style={{ fontSize:18, color:C.warning, flexShrink:0 }} aria-hidden="true" />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#92400e" }}>
                Finance code entry suspended — revision in progress
              </div>
              <div style={{ fontSize:12, color:"#78350f", marginTop:2 }}>
                A revision affecting Cost Account fields is in progress. Finance codes cannot be submitted until GM re-approves.
              </div>
            </div>
            <div style={{
              textAlign:"right", flexShrink:0,
              fontSize:12, color: elapsedColor, fontWeight:600,
            }}>
              <i className="ti ti-clock" style={{ fontSize:13 }} aria-hidden="true" />
              {" "}{elapsedDays}d elapsed
              {elapsedDays >= 7 && (
                <div style={{ fontSize:10, fontWeight:400, color: elapsedColor, marginTop:2 }}>
                  {elapsedDays >= 14 ? "⚠ Overdue — escalate" : "Awaiting re-approval"}
                </div>
              )}
            </div>
          </div>
          {activeRevision && (
            <div style={{ background:"#fff7ed", padding:"10px 16px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, fontSize:12 }}>
                <div>
                  <span style={{ color:C.textDis, fontWeight:500 }}>Initiated by: </span>
                  <span style={{ color:C.textPri, fontWeight:500 }}>
                    {triggeredByUser ? `${triggeredByUser.name} (${ROLE_LABELS[triggeredByUser.role]})` : "—"}
                  </span>
                </div>
                <div>
                  <span style={{ color:C.textDis, fontWeight:500 }}>Date: </span>
                  <span style={{ color:C.textPri }}>{fmtDate(activeRevision.triggeredAt)}</span>
                </div>
                <div style={{ gridColumn:"1 / -1" }}>
                  <span style={{ color:C.textDis, fontWeight:500 }}>Reason: </span>
                  <span style={{ color:C.textPri, fontStyle:"italic" }}>{activeRevision.reason}</span>
                </div>
                <div style={{ gridColumn:"1 / -1" }}>
                  <span style={{
                    fontSize:11, fontWeight:600, background:"#fff7ed", color:"#c2410c",
                    padding:"2px 8px", borderRadius:4, border:"1px solid #fed7aa",
                  }}>
                    <i className="ti ti-building-bank" style={{ fontSize:11 }} aria-hidden="true" />
                    {" "}Cost Account field change declared — verify draft codes when revision is approved
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revision-IN-PROGRESS but NOT blocking CA — parallel work allowed */}
      {revisionInProgress && !revisionBlocksCA && (
        <div style={{
          display:"flex", alignItems:"flex-start", gap:10,
          background:"#eff6ff", border:`1px solid #bfdbfe`,
          borderRadius:8, padding:"12px 16px", marginBottom:16,
        }}>
          <i className="ti ti-info-circle" style={{ fontSize:18, color:C.midBlue, flexShrink:0, marginTop:1 }} aria-hidden="true" />
          <div style={{ fontSize:12, color:"#1e40af", lineHeight:1.6 }}>
            <strong>Revision in progress (Rev. {activeRevision?.revisionNo}) — no impact on finance codes.</strong>
            {" "}The declared field changes do not affect Cost Account. You may proceed with finance code entry in parallel.
            {activeRevision && (
              <span style={{ color:"#3b82f6" }}>
                {" "}Reason: <em>{activeRevision.reason}</em>
              </span>
            )}
          </div>
        </div>
      )}

      {!isCA && !isActive && !submitted && !revisionBlocksCA && !revisionInProgress && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc",
          border: "1px solid " + C.border, borderRadius: 6, padding: "8px 12px",
          fontSize: 12, color: C.textSec, marginBottom: 16 }}>
          <i className="ti ti-eye" style={{ fontSize: 14 }} aria-hidden="true" />
          Viewing as <strong>{ROLE_LABELS[currentUser.role]}</strong>. This form is currently held by <strong>{STAGE_LABEL[project.stage]}</strong>.
        </div>
      )}

      {isPreApproval && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#eff6ff",
          border: "1px solid #bfdbfe", borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
          <i className="ti ti-edit" style={{ fontSize: 16 }} aria-hidden="true" />
          Drafting in advance — currently held by <strong>{STAGE_LABEL[project.stage]}</strong>. Codes saved here are a draft and won't be submitted to IT until GM signs off.
        </div>
      )}

      {isActive && !submitted && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#dcfce7",
          border: "1px solid #86efac", borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: "#15803d", marginBottom: 16 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 16 }} aria-hidden="true" />
          GM approved — finance codes can now be assigned.
        </div>
      )}

      {submitted && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#dbeafe",
          border: "1px solid #93c5fd", borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 16 }} aria-hidden="true" />
          Finance codes submitted — form advancing to IT for Oracle system setup.
        </div>
      )}

      {!submitted && isHandedToIT && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc",
          border: "1px solid " + C.border, borderRadius: 6, padding: "10px 14px",
          fontSize: 13, color: C.textSec, marginBottom: 16 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 16 }} aria-hidden="true" />
          Finance codes already submitted — IT is setting up the Oracle project code.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20, alignItems: "start" }}>
        <div>
          <ProjectIdentifiersBlock project={project} />

          <div style={{ ...cardSt, borderLeft: "4px solid #16a34a" }}>
            {secTit("ti-highlight", "Project Data Reference")}
            <div style={{ fontSize: 11, color: C.textDis, marginTop: -10, marginBottom: 16 }}>
              Fields highlighted in green on the official Project Data Sheet — essential for finance code creation.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              {[
                ["Name of Developer", B.developer || "—"],
                ["Project Phasing",   B.projectPhasing || "—"],
              ].map(function(arr){ return (<div key={arr[0]}>{fLabel(arr[0])}{roValCA(arr[1])}</div>); })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              {[
                ["Name of PIC (Project in Charge)", (getUser(project.assignedRoles && project.assignedRoles.pic) || {}).name || "—"],
                ["Name of SIC (Site in Charge)",    (getUser(project.assignedRoles && project.assignedRoles.sic) || {}).name || "—"],
              ].map(function(arr){ return (<div key={arr[0]}>{fLabel(arr[0])}{roValCA(arr[1])}</div>); })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 14 }}>
              {[
                ["Cost Control Leader (Accounting Manager)",         B.costControlLeaders && B.costControlLeaders.accountingManager || "—"],
                ["Cost Control Leader (QS Manager)",                 B.costControlLeaders && B.costControlLeaders.qsManager || "—"],
                ["Cost Control Leader (Contracts Manager)",          B.costControlLeaders && B.costControlLeaders.contractsManager || "—"],
              ].map(function(arr){ return (<div key={arr[0]}>{fLabel(arr[0])}{roValCA(arr[1])}</div>); })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 14 }}>
              {[
                ["Site Area",          (B.siteAreaSM||"—")+" m²"],
                ["GFA",                (B.gfaSM||"—")+" m²"],
                ["Construction Floor Area", (B.constructionFloorAreaSM||"—")+" m²"],
              ].map(function(arr){ return (<div key={arr[0]}>{fLabel(arr[0])}{roValCA(arr[1])}</div>); })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 18 }}>
              {[
                ["Main Contractor",    B.mainContractor||"—"],
                ["Type of Contract",   (C2.typeOfContract||[]).map(function(v){return ({inhouse:"In-house",jv:"JV",tender:"Tender",lump_sum:"Lump Sum",others:"Others"}[v]||v);}).join(", ")||"—"],
                ["Payment Term",       (C2.paymentTerm||[]).map(function(v){return ({monthly_progress:"Monthly Progress",scheduled:"Scheduled",architect_certificate:"Architect Certificate"}[v]||v);}).join(", ")||"—"],
              ].map(function(arr){ return (<div key={arr[0]}>{fLabel(arr[0])}{roValCA(arr[1])}</div>); })}
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase",
              letterSpacing: "0.04em", marginBottom: 8 }}>Key Dates</div>
            <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 1fr", gap: 8,
              padding: "4px 0 8px", borderBottom: "1px solid " + C.border, marginBottom: 2 }}>
              {["Milestone","Target","Actual"].map(function(h){
                return (<div key={h} style={{ fontSize: 11, fontWeight: 600, color: C.textSec,
                  textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>);
              })}
            </div>
            {[
              ["Commencement",               "commencement"],
              ["Occupation Permit",          "occupationPermit"],
              ["Phased Occupation Permit",   "phasedOccupationPermit"],
              ["Practical Completion",       "practicalCompletion"],
              ["Sectional Completion",       "sectionalCompletion"],
              ["Consent to Assign (CTOA)",   "consentToAssign"],
              ["Certificate of Compliance",  "certificateOfCompliance"],
            ].map(function(arr) {
              var label = arr[0], key = arr[1];
              var d = (B.dates && B.dates[key]) || {};
              return (
                <div key={key} style={{ display: "grid", gridTemplateColumns: "170px 1fr 1fr", gap: 8,
                  alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f8fafc" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.textSec }}>{label}</div>
                  {roValCA(d.target)}
                  {roValCA(d.actual)}
                </div>
              );
            })}
          </div>

          <div style={cardSt}>
            {secTit("ti-report-money", "Section D — Finance Codes")}

            {canEdit && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fffbeb",
                border: "1px solid #d97706", borderRadius: 6, padding: "10px 12px", marginBottom: 16,
                fontSize: 12, color: "#92400e" }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                <div>Enter the Oracle Finance Project Code and all relevant Sub-Project Codes. Confirm codes with QS before submission.</div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              {fLabel("Finance Project Code", true)}
              {canEdit ? (
                <input value={financeCode} onChange={function(e){setFinanceCode(e.target.value);}}
                  placeholder="e.g. 2025-SKW-001" style={inSt} />
              ) : roValCA(financeCode || existing.financeProjectCode)}
              <div style={{ fontSize: 11, color: C.textDis, marginTop: 4 }}>Oracle Finance Project Code — assigned by Accounting Team</div>
            </div>

            <div>
              {fLabel("Finance Sub-Project Codes")}
              <div style={{ border: "1px solid " + C.border, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 36px",
                  background: "#f8fafc", borderBottom: "1px solid " + C.border, padding: "6px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.04em" }}>Sub-Project Code</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</div>
                  <div />
                </div>
                {subCodes.map(function(row, idx) {
                  return (
                    <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 36px",
                      borderBottom: idx < subCodes.length-1 ? "1px solid "+C.border : "none", alignItems: "center" }}>
                      <div style={{ padding: "6px 12px", borderRight: "1px solid "+C.border }}>
                        {canEdit ? (
                          <input value={row.subCode} onChange={function(e){updateRow(row.id,"subCode",e.target.value);}}
                            placeholder="e.g. 001-A"
                            style={{ height:30, border:"none", fontSize:12, fontFamily:"inherit",
                              background:"transparent", padding:"0 4px", width:"100%", outline:"none" }} />
                        ) : <span style={{ fontSize:13, color:C.textPri }}>{row.subCode||"—"}</span>}
                      </div>
                      <div style={{ padding: "6px 12px", borderRight: "1px solid "+C.border }}>
                        {canEdit ? (
                          <input value={row.description} onChange={function(e){updateRow(row.id,"description",e.target.value);}}
                            placeholder="e.g. Main Contract"
                            style={{ height:30, border:"none", fontSize:12, fontFamily:"inherit",
                              background:"transparent", padding:"0 4px", width:"100%", outline:"none" }} />
                        ) : <span style={{ fontSize:13, color:C.textSec }}>{row.description||"—"}</span>}
                      </div>
                      <div style={{ padding:"0 8px", display:"flex", justifyContent:"center" }}>
                        {canEdit && subCodes.length > 1 && (
                          <button onClick={function(){removeRow(row.id);}}
                            style={{ background:"none", border:"none", cursor:"pointer",
                              color:C.textDis, fontSize:16, display:"flex", alignItems:"center" }}>
                            <i className="ti ti-x" style={{ fontSize:14 }} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {canEdit && (
                <button onClick={addRow}
                  style={{ display:"flex", alignItems:"center", gap:5, fontSize:12,
                    color:C.midBlue, background:"none", border:"1px solid "+C.border,
                    borderRadius:5, padding:"5px 12px", cursor:"pointer", fontFamily:"inherit" }}>
                  <i className="ti ti-plus" style={{ fontSize:13 }} aria-hidden="true" />
                  Add sub-project code
                </button>
              )}
              <div style={{ fontSize:11, color:C.textDis, marginTop:6 }}>
                Add one row per sub-project code. Discuss with QS in advance to confirm the list.
              </div>
            </div>
          </div>

          {canEdit && !submitted && (
            <div style={cardSt}>
              <div style={{ fontSize:15, fontWeight:600, color:C.textPri, marginBottom:14,
                paddingBottom:10, borderBottom:"1px solid #f1f5f9",
                display:"flex", alignItems:"center", gap:8 }}>
                <i className={"ti " + (canSubmit ? "ti-pen-check" : "ti-device-floppy")} style={{ color:C.navy, fontSize:16 }} aria-hidden="true" />
                {canSubmit ? "Submit Finance Codes" : "Save Draft"}
              </div>
              <div style={{ fontSize:12, color:C.textSec, marginBottom:14 }}>
                {canSubmit
                  ? "Once submitted, the form advances to IT for Oracle system setup. Ensure all codes are confirmed before submitting."
                  : "Save your progress here. You can keep refining these codes as the project moves through approval — nothing is sent to IT until Cost Account submits after GM signs off."}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {canSubmit && (
                  <button onClick={handleSubmit}
                    style={{ display:"flex", alignItems:"center", gap:6, background:C.navy, color:"#fff",
                      border:"none", borderRadius:6, padding:"0 24px", height:40,
                      fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    <i className="ti ti-send" style={{ fontSize:16 }} aria-hidden="true" />
                    Submit to IT
                  </button>
                )}
                <button onClick={handleSaveDraft}
                  style={{ background:"#fff", color:C.textPri, border:"1px solid "+C.border,
                    borderRadius:6, padding:"0 16px", height:40, fontSize:14,
                    cursor:"pointer", fontFamily:"inherit" }}>
                  Save Draft
                </button>
                {draftSavedAt && (
                  <span style={{ fontSize:11, color:C.textDis }}>
                    Saved {draftSavedAt.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ position:"sticky", top:0 }}>
          <div style={{ background:"#fff", border:"1px solid "+C.border, borderRadius:8, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.textSec, textTransform:"uppercase",
              letterSpacing:"0.04em", marginBottom:12 }}>Project Summary</div>
            {[
              { label:"Site Code",  value:project.siteCode, mono:true },
              { label:"Short Name", value:project.shortName },
              { label:"PIC",        value:getUser(project.assignedRoles&&project.assignedRoles.pic)&&getUser(project.assignedRoles.pic).name||"—" },
              { label:"SIC",        value:getUser(project.assignedRoles&&project.assignedRoles.sic)&&getUser(project.assignedRoles.sic).name||"—" },
              { label:"Engineer",   value:getUser(project.assignedRoles&&project.assignedRoles.engineer)&&getUser(project.assignedRoles.engineer).name||"—" },
              { label:"QS TL",      value:getUser(project.assignedRoles&&project.assignedRoles.qsTeamLeader)&&getUser(project.assignedRoles.qsTeamLeader).name||"—" },
            ].map(function(item) {
              return (
                <div key={item.label} style={{ paddingBottom:6, marginBottom:6, borderBottom:"1px solid #f8fafc" }}>
                  <div style={{ fontSize:11, color:C.textDis, fontWeight:500 }}>{item.label}</div>
                  <div style={{ fontSize:13, color:C.textPri, fontWeight:500,
                    fontFamily: item.mono ? "'SF Mono',Consolas,monospace" : "inherit" }}>{item.value||"—"}</div>
                </div>
              );
            })}
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
                letterSpacing:"0.04em", marginBottom:8 }}>Post-Approval Tasks</div>
              {[
                { label:"Finance Codes", done: project.postApprovalTasks&&project.postApprovalTasks.financeCodesStatus==="assigned" || submitted },
                { label:"IT System Setup", done: project.postApprovalTasks&&project.postApprovalTasks.itSetupStatus==="complete" },
              ].map(function(t) {
                return (
                  <div key={t.label} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", fontSize:12 }}>
                    <i className={"ti "+(t.done?"ti-circle-check":"ti-circle-dashed")}
                      style={{ fontSize:14, color:t.done?C.success:C.textDis, flexShrink:0 }} aria-hidden="true" />
                    <span style={{ color:t.done?C.success:C.textDis }}>{t.label}</span>
                  </div>
                );
              })}
            </div>
            <Stepper currentStage={submitted?"it":project.stage} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Full Data Sheet — collapsible read-only panel (used in IT view) ──────

function FullDataSheet({ project }) {
  const [open, setOpen] = useState({ a:false, b:false, c:false, d:false });
  const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const B  = project.sectionB || {};
  const C2 = project.sectionC || {};
  const D  = project.sectionD || {};
  const loc = getLoc(project.locationUUID);

  // Shared read-only value display
  const ro = (v, mono) => (
    <div style={{
      minHeight:34, border:`1px solid ${C.border}`, borderRadius:6,
      padding:"6px 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
      display:"flex", alignItems:"center",
      fontFamily: mono ? "'SF Mono',Consolas,monospace" : "inherit",
      lineHeight:1.4,
    }}>
      {v || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}
    </div>
  );

  const lbl = (text) => (
    <div style={{ fontSize:11, fontWeight:500, color:C.textSec, marginBottom:4 }}>{text}</div>
  );

  const field = (label, value, mono) => (
    <div key={label}>
      {lbl(label)}
      {ro(value, mono)}
    </div>
  );

  // Section accordion header
  const SectionHeader = ({ sKey, icon, title, subtitle }) => (
    <button
      onClick={() => toggle(sKey)}
      style={{
        width:"100%", display:"flex", alignItems:"center", gap:10,
        background: open[sKey] ? C.navy : "#f8fafc",
        border:`1px solid ${open[sKey] ? C.navy : C.border}`,
        borderRadius: open[sKey] ? "8px 8px 0 0" : 8,
        padding:"11px 16px", cursor:"pointer", fontFamily:"inherit",
        marginBottom: open[sKey] ? 0 : 8,
        transition:"background 0.15s",
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize:16, color: open[sKey] ? "#7dd3fc" : C.navy, flexShrink:0 }} aria-hidden="true" />
      <div style={{ flex:1, textAlign:"left" }}>
        <div style={{ fontSize:13, fontWeight:600, color: open[sKey] ? "#fff" : C.textPri }}>{title}</div>
        {subtitle && <div style={{ fontSize:11, color: open[sKey] ? "#93c5fd" : C.textSec, marginTop:1 }}>{subtitle}</div>}
      </div>
      <i className={`ti ${open[sKey] ? "ti-chevron-up" : "ti-chevron-down"}`}
        style={{ fontSize:14, color: open[sKey] ? "#7dd3fc" : C.textDis }} aria-hidden="true" />
    </button>
  );

  const panelSt = {
    border:`1px solid ${C.navy}`, borderTop:"none",
    borderRadius:"0 0 8px 8px", padding:20, marginBottom:8,
    background:"#fff",
  };

  const grid2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 };
  const grid3 = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 };

  const natLabels = { residential:"Residential", retail:"Retail", office:"Office",
    industrial:"Industrial", hotel:"Hotel", data_centre:"Data Centre",
    aa_works:"A&A Works", others:"Others", mixed:"Mixed" };
  const contractLabels = { inhouse:"In-house (Internal Project)", jv:"JV (External Project)",
    tender:"Tender", lump_sum:"Lump Sum", others:"Others" };
  const paymentLabels = { monthly_progress:"Monthly Progress Payment",
    scheduled:"Scheduled Payment", architect_certificate:"Architect Certificate" };
  const dlpLabels = { "12_months":"12 Months", "16_months":"16 Months", "3_years":"3 Years" };

  const dateRow = (label, dateObj) => (
    <div key={label} style={{
      display:"grid", gridTemplateColumns:"180px 1fr 1fr", gap:8,
      alignItems:"center", padding:"5px 0", borderBottom:`1px solid #f8fafc`,
    }}>
      <div style={{ fontSize:12, color:C.textSec, fontWeight:500 }}>{label}</div>
      {ro(fmtDate(dateObj?.target))}
      {ro(fmtDate(dateObj?.actual))}
    </div>
  );

  return (
    <div style={{ marginTop:8 }}>

      {/* ── Section A ── */}
      <SectionHeader sKey="a" icon="ti-id" title="Project Identifiers & Location" subtitle="Site code, lot reference, location" />
      {open.a && (
        <div style={panelSt}>
          <div style={grid3}>
            {field("Site Code",   project.siteCode,   true)}
            {field("Full Name",   project.fullName)}
            {field("Short Name",  project.shortName)}
          </div>
          <div style={grid2}>
            {field("Estate / Development Name", project.estateNameTBC ? "TBC" : project.estateName)}
            {field("Nature of Project", (project.nature||[]).map(n => natLabels[n]||n).join(", "))}
          </div>
          <div style={{ ...grid3, marginBottom:0 }}>
            {field("Lot Reference", loc ? locPrimaryLabel(loc) : "—")}
            {field("Street", loc?.streetNameNumber || "—")}
            {field("District", loc?.district || "—")}
          </div>
        </div>
      )}

      {/* ── Section B ── */}
      <SectionHeader sKey="b" icon="ti-building" title="Project Data" subtitle="Areas, dates, team, consultants" />
      {open.b && (
        <div style={panelSt}>

          {/* Areas */}
          <div style={{ fontSize:12, fontWeight:600, color:C.textPri, marginBottom:8,
            paddingBottom:4, borderBottom:`1px solid #f1f5f9` }}>Areas</div>
          <div style={grid3}>
            {field("Site Area (m²)", B.siteAreaSM)}
            {field("Site Area (ft²)", B.siteAreaSF)}
          </div>
          <div style={grid3}>
            {field("GFA (m²)", B.gfaSM)}
            {field("GFA (ft²)", B.gfaSF)}
          </div>
          <div style={grid3}>
            {field("Domestic GFA (m²)", B.domesticGfaSM)}
            {field("Domestic GFA (ft²)", B.domesticGfaSF)}
          </div>
          <div style={grid3}>
            {field("Non-Domestic GFA (m²)", B.nonDomesticGfaSM)}
            {field("Non-Domestic GFA (ft²)", B.nonDomesticGfaSF)}
          </div>
          <div style={{ ...grid3, marginBottom:16 }}>
            {field("CFA (m²)", B.constructionFloorAreaSM)}
            {field("CFA (ft²)", B.constructionFloorAreaSF)}
          </div>

          {/* Building description */}
          <div style={{ fontSize:12, fontWeight:600, color:C.textPri, marginBottom:8,
            paddingBottom:4, borderBottom:`1px solid #f1f5f9` }}>Building Description</div>
          <div style={{ ...grid2, marginBottom:12 }}>
            {field("No. of Blocks & Storeys", B.noOfBlocksStorey)}
            {field("BeamPlus Target / Actual", [B.beamPlus?.target, B.beamPlus?.actual].filter(Boolean).join(" / "))}
          </div>
          <div style={grid3}>
            {field("Tower Units",   B.residentialUnits?.tower)}
            {field("Villa Units",   B.residentialUnits?.villa)}
            {field("House Units",   B.residentialUnits?.house)}
          </div>
          <div style={grid3}>
            {field("Residential Carpark",  B.carpark?.residential)}
            {field("Commercial Carpark",   B.carpark?.commercial)}
            {field("Visitor Carpark",      B.carpark?.visitor)}
          </div>
          <div style={{ ...grid3, marginBottom:16 }}>
            {field("Motorcycle",           B.carpark?.motorcycle)}
            {field("Bicycle",              B.carpark?.bicycle)}
            {field("Loading/Unloading",    B.carpark?.loadingUnloading)}
          </div>
          <div style={{ ...grid2, marginBottom:16 }}>
            {field("Defect Liability Period", dlpLabels[B.defectLiabilityPeriod] || B.defectLiabilityPeriod)}
            {field("Project Phasing", B.projectPhasing)}
          </div>

          {/* Dates */}
          <div style={{ fontSize:12, fontWeight:600, color:C.textPri, marginBottom:8,
            paddingBottom:4, borderBottom:`1px solid #f1f5f9` }}>Key Dates</div>
          <div style={{ display:"grid", gridTemplateColumns:"180px 1fr 1fr", gap:8,
            marginBottom:4 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.04em" }}>Date</div>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.04em" }}>Target</div>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.04em" }}>Actual</div>
          </div>
          {[
            ["Commencement",              B.dates?.commencement],
            ["Site Formation Commencement", B.dates?.siteFormationCommencement],
            ["Cap Commencement",          B.dates?.capCommencement],
            ["Occupation Permit (OP)",    B.dates?.occupationPermit],
            ["Phased OP",                 B.dates?.phasedOccupationPermit],
            ["Practical Completion",      B.dates?.practicalCompletion],
            ["Sectional Completion",      B.dates?.sectionalCompletion],
            ["Consent to Assign (CTOA)",  B.dates?.consentToAssign],
            ["Certificate of Compliance", B.dates?.certificateOfCompliance],
            ["Building Covenant",         B.dates?.buildingCovenant],
          ].map(([label, dateObj]) => dateRow(label, dateObj))}

          {/* Developer & CPM */}
          <div style={{ fontSize:12, fontWeight:600, color:C.textPri, margin:"16px 0 8px",
            paddingBottom:4, borderBottom:`1px solid #f1f5f9` }}>Developer & Client PM</div>
          <div style={grid2}>
            {field("Developer", B.developer)}
            {field("CPM Name", B.cpm?.name)}
          </div>
          <div style={{ ...grid2, marginBottom:16 }}>
            {field("CPM Title", B.cpm?.title)}
            {field("CPM Email", B.cpm?.email)}
          </div>

          {/* BD Codes / Technical team */}
          <div style={{ fontSize:12, fontWeight:600, color:C.textPri, marginBottom:8,
            paddingBottom:4, borderBottom:`1px solid #f1f5f9` }}>Technical Team & BD Codes</div>
          <div style={grid2}>
            {field("Technical Director (BDTD)", B.technicalDirector?.name)}
            {field("Authorised Signatory (BDAS)", B.authorisedSignatory?.name)}
          </div>
          <div style={grid2}>
            {field("Design Architect", B.designArchitect)}
            {field("Architecture, AP (BDAP)", B.architectureAP?.name)}
          </div>
          <div style={grid2}>
            {field("Structural Consultant (BDRSE)", B.rse?.name)}
            {field("M&E Consultant", B.meConsultant)}
          </div>
          <div style={grid2}>
            {field("Geotechnical Consultant (BDRGE)", B.rge?.name)}
            {field("Landscape Consultant", B.landscapeConsultant)}
          </div>
          <div style={grid2}>
            {field("Interior Designer", B.interiorDesigner)}
            {field("Sustainability / BeamPlus Consultant", B.sustainabilityConsultant)}
          </div>
          <div style={{ ...grid2, marginBottom:16 }}>
            {field("QS Consultant", B.qsConsultant)}
            {field("Estate Management", B.estateManagement)}
          </div>
          {(B.otherConsultants||[]).length > 0 && (
            <div style={{ marginBottom:16 }}>
              {lbl("Other Consultants")}
              {B.otherConsultants.map((oc, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:8, marginBottom:4 }}>
                  {ro(oc.title)}
                  {ro(oc.name)}
                </div>
              ))}
            </div>
          )}

          {/* Main Contractor */}
          <div style={{ fontSize:12, fontWeight:600, color:C.textPri, marginBottom:8,
            paddingBottom:4, borderBottom:`1px solid #f1f5f9` }}>Main Contractor</div>
          <div style={grid2}>
            {field("Main Contractor", B.mainContractor)}
            {field("Contractor Licence No.", B.contractorLicence)}
          </div>
          <div style={{ ...grid3, marginBottom:0 }}>
            {field("Cost Control — Accounting Manager", B.costControlLeaders?.accountingManager)}
            {field("Cost Control — QS Manager",         B.costControlLeaders?.qsManager)}
            {field("Cost Control — Contracts Manager",  B.costControlLeaders?.contractsManager)}
          </div>
        </div>
      )}

      {/* ── Section C ── */}
      <SectionHeader sKey="c" icon="ti-file-description" title="Contract" subtitle="Type of contract, payment term" />
      {open.c && (
        <div style={panelSt}>
          <div style={grid2}>
            {field("Type of Contract",
              (C2.typeOfContract||[]).map(v => contractLabels[v]||v).join(", "))}
            {field("Payment Term",
              (C2.paymentTerm||[]).map(v => paymentLabels[v]||v).join(", "))}
          </div>
          <div>
            {lbl("Remarks")}
            <div style={{
              minHeight:60, border:`1px solid ${C.border}`, borderRadius:6,
              padding:"8px 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
              lineHeight:1.6,
            }}>
              {C2.remarks || <span style={{ color:C.textDis, fontStyle:"italic" }}>—</span>}
            </div>
          </div>
        </div>
      )}

      {/* ── Section D ── */}
      <SectionHeader sKey="d" icon="ti-report-money" title="Finance Codes" subtitle="Oracle project code and sub-codes" />
      {open.d && (
        <div style={panelSt}>
          <div style={{ marginBottom:16 }}>
            {lbl("Finance Project Code")}
            <div style={{
              height:36, border:`1px solid #bfdbfe`, borderRadius:6,
              padding:"0 10px", fontSize:14, fontWeight:700,
              color:"#1e40af", background:"#eff6ff",
              display:"flex", alignItems:"center",
              fontFamily:"'SF Mono',Consolas,monospace",
            }}>
              {D.financeProjectCode || <span style={{ color:C.textDis, fontStyle:"italic", fontWeight:400 }}>—</span>}
            </div>
          </div>
          {(D.subCodes||[]).length > 0 && (
            <div>
              {lbl("Finance Sub-Project Codes")}
              <div style={{ border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"160px 1fr",
                  background:"#f8fafc", borderBottom:`1px solid ${C.border}`, padding:"6px 12px" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.04em" }}>Sub-Code</div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.04em" }}>Description</div>
                </div>
                {D.subCodes.map((row, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"160px 1fr",
                    borderBottom: i < D.subCodes.length-1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ padding:"7px 12px", borderRight:`1px solid ${C.border}`,
                      fontSize:13, fontFamily:"'SF Mono',Consolas,monospace", color:C.textPri }}>
                      {row.subCode||"—"}
                    </div>
                    <div style={{ padding:"7px 12px", fontSize:13, color:C.textSec }}>
                      {row.description||"—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Screen 7: IT Setup ────────────────────────────────────────────────────

function ITView({ currentUser, project, onBack, onUpdated, onInitiateRevision }) {
  const B  = project.sectionB || {};
  const C2 = project.sectionC || {};
  const isIT = currentUser.role === "it";
  const isActive = project.stage === "it";
  const canAct = isIT && isActive;
  const isComplete = project.stage === "complete";
  const canInitiateRevision = isComplete && ["engineer","sic","qs_team_leader"].includes(currentUser.role);

  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState("");

  const cardSt = {
    background: "#fff", border: "1px solid " + C.border,
    borderRadius: 8, padding: 24, marginBottom: 16,
  };
  const secTit = function(icon, text) {
    return (
      <div style={{ fontSize:15, fontWeight:600, color:C.textPri, marginBottom:16,
        paddingBottom:10, borderBottom:"1px solid #f1f5f9",
        display:"flex", alignItems:"center", gap:8 }}>
        <i className={"ti "+icon} style={{ color:C.navy, fontSize:16 }} aria-hidden="true" />
        {text}
      </div>
    );
  };

  function handleConfirm() {
    var updated = Object.assign({}, project, {
      stage: "complete",
      status: "approved",
      postApprovalTasks: Object.assign({}, project.postApprovalTasks||{}, {
        itSetupStatus: "complete",
        itNotes: notes,
      }),
      approvalHistory: (project.approvalHistory||[]).concat([{
        stage:"it", action:"completed",
        userUUID:currentUser.uuid,
        timestamp:new Date().toISOString(),
        note:notes,
      }]),
      updatedAt:new Date().toISOString(),
    });
    setConfirmed(true);
    onUpdated(updated);
  }

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSec, marginBottom:16 }}>
        <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>All Projects</a>
        <span style={{ color:C.textDis }}>›</span>
        <span>{project.siteCode}</span>
        <span style={{ color:C.textDis }}>›</span>
        <span>IT System Setup</span>
        {canInitiateRevision && onInitiateRevision && (
          <button onClick={onInitiateRevision} style={{
            marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
            background:"#fff", color:C.warning, border:`1px solid ${C.warning}`,
            borderRadius:6, padding:"0 14px", height:32, fontSize:12,
            fontWeight:500, cursor:"pointer", fontFamily:"inherit",
          }}>
            <i className="ti ti-refresh" style={{ fontSize:13 }} aria-hidden="true" />
            Initiate Revision
          </button>
        )}
      </div>

      {!isActive && !confirmed && !isComplete && !isIT && (
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#f8fafc",
          border:"1px solid "+C.border, borderRadius:6, padding:"8px 12px",
          fontSize:12, color:C.textSec, marginBottom:16 }}>
          <i className="ti ti-eye" style={{ fontSize:14 }} aria-hidden="true" />
          Viewing as <strong>{ROLE_LABELS[currentUser.role]}</strong>. This form is currently held by <strong>{STAGE_LABEL[project.stage]}</strong>.
        </div>
      )}

      {/* Banner — varies by stage */}
      {isComplete ? (
        <div style={{ display:"flex", alignItems:"center", gap:8,
          background:"#f0fdf4", border:"1px solid #86efac", borderRadius:6,
          padding:"10px 14px", fontSize:13, color:"#166534", marginBottom:16 }}>
          <i className="ti ti-circle-check" style={{ fontSize:16, flexShrink:0 }} aria-hidden="true" />
          Project data sheet created. To revise any project data, use Initiate Revision.
        </div>
      ) : (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#dcfce7",
          border:"1px solid #86efac", borderRadius:6, padding:"10px 14px",
          fontSize:13, color:"#15803d", marginBottom:16 }}>
          <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
          Oracle code assigned — IT system setup can now proceed.
        </div>
      )}

      {confirmed && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#dbeafe",
          border:"1px solid #93c5fd", borderRadius:6, padding:"10px 14px",
          fontSize:13, color:"#1e40af", marginBottom:16 }}>
          <i className="ti ti-confetti" style={{ fontSize:16 }} aria-hidden="true" />
          IT setup confirmed — project is now <strong>Issued</strong>. Notification sent to all section heads and secretaries.
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
        <div>
          {/* Full Project Data Sheet — standard read-only reference */}
          <div style={cardSt}>
            {secTit("ti-ruler-2", "Floor Areas")}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:0 }}>
              {[
                ["Site Area",               `${B.siteAreaSM||"—"} m² / ${B.siteAreaSF||"—"} ft²`],
                ["Gross Floor Area",        `${B.gfaSM||"—"} m² / ${B.gfaSF||"—"} ft²`],
                ["Domestic GFA",            `${B.domesticGfaSM||"—"} m² / ${B.domesticGfaSF||"—"} ft²`],
                ["Non-Domestic GFA",        `${B.nonDomesticGfaSM||"—"} m² / ${B.nonDomesticGfaSF||"—"} ft²`],
                ["Construction Floor Area", `${B.constructionFloorAreaSM||"—"} m² / ${B.constructionFloorAreaSF||"—"} ft²`],
              ].map(function(arr) {
                return (
                  <div key={arr[0]}>
                    {fLabel(arr[0])}
                    <div style={{ height:34, border:"1px solid "+C.border, borderRadius:6,
                      padding:"0 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
                      display:"flex", alignItems:"center" }}>{arr[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardSt}>
            {secTit("ti-building", "Building Description")}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              {[
                ["Nature of Project",       (B.natureOfProject||[]).map(function(n){return n.charAt(0).toUpperCase()+n.slice(1);}).join(", ")||"—"],
                ["No. of Blocks & Storeys", B.noOfBlocksStorey||"—"],
                ["Defect Liability Period", B.defectLiabilityPeriod||"—"],
                ["BeamPlus Target",         B.beamPlus&&B.beamPlus.target||"—"],
                ["BeamPlus Actual",         B.beamPlus&&B.beamPlus.actual||"—"],
                ["Project Phasing",         B.projectPhasing||"—"],
              ].map(function(arr) {
                return (
                  <div key={arr[0]}>
                    {fLabel(arr[0])}
                    <div style={{ height:34, border:"1px solid "+C.border, borderRadius:6,
                      padding:"0 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
                      display:"flex", alignItems:"center" }}>{arr[1]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginBottom:0 }}>
              {fLabel("Residential Units")}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[["Tower","tower"],["Villa","villa"],["House","house"]].map(function(arr) {
                  return (
                    <div key={arr[0]}>
                      <div style={{ fontSize:11, color:C.textDis, marginBottom:4 }}>{arr[0]}</div>
                      <div style={{ height:34, border:"1px solid "+C.border, borderRadius:6,
                        padding:"0 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
                        display:"flex", alignItems:"center" }}>
                        {(B.residentialUnits&&B.residentialUnits[arr[1]])||"—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={cardSt}>
            {secTit("ti-calendar", "Key Dates")}
            <div style={{ display:"grid", gridTemplateColumns:"170px 1fr 1fr", gap:8,
              padding:"4px 0 8px", borderBottom:"1px solid "+C.border, marginBottom:4 }}>
              {["Date","Target","Actual"].map(function(h) {
                return (<div key={h} style={{ fontSize:11, fontWeight:600, color:C.textSec,
                  textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</div>);
              })}
            </div>
            {[
              ["Commencement","commencement"],
              ["Site Formation Commencement","siteFormationCommencement"],
              ["Cap Commencement","capCommencement"],
              ["Occupation Permit","occupationPermit"],
              ["Phased OP","phasedOccupationPermit"],
              ["Practical Completion","practicalCompletion"],
              ["Sectional Completion","sectionalCompletion"],
              ["Consent to Assign","consentToAssign"],
              ["Cert. of Compliance","certificateOfCompliance"],
              ["Building Covenant","buildingCovenant"],
            ].map(function(arr) {
              var d = (B.dates&&B.dates[arr[1]])||{};
              var roCell = function(v) {
                return (<div style={{ height:32, border:"1px solid "+C.border, borderRadius:6,
                  padding:"0 10px", fontSize:12, color:C.textSec, background:"#f8fafc",
                  display:"flex", alignItems:"center" }}>{v||"—"}</div>);
              };
              return (
                <div key={arr[1]} style={{ display:"grid", gridTemplateColumns:"170px 1fr 1fr", gap:8,
                  alignItems:"center", padding:"5px 0", borderBottom:"1px solid #f8fafc" }}>
                  <div style={{ fontSize:12, fontWeight:500, color:C.textSec }}>{arr[0]}</div>
                  {roCell(d.target)}
                  {roCell(d.actual)}
                </div>
              );
            })}
          </div>

          <div style={cardSt}>
            {secTit("ti-users", "Project Team & Consultants")}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["Developer",                  B.developer||"—"],
                ["CPM",                        B.cpm&&B.cpm.name||"—"],
                ["Main Contractor",            B.mainContractor||"—"],
                ["Design Architect",           B.designArchitect||"—"],
                ["Structural Consultant",      B.rse&&B.rse.name||"—"],
                ["M&E Consultant",             B.meConsultant||"—"],
                ["Geotechnical Consultant",    B.rge&&B.rge.name||"—"],
                ["Landscape Consultant",       B.landscapeConsultant||"—"],
                ["Sustainability Consultant",  B.sustainabilityConsultant||"—"],
                ["QS Consultant",              B.qsConsultant||"—"],
                ["Estate Management",          B.estateManagement||"—"],
              ].map(function(arr) {
                return (
                  <div key={arr[0]}>
                    {fLabel(arr[0])}
                    <div style={{ height:34, border:"1px solid "+C.border, borderRadius:6,
                      padding:"0 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
                      display:"flex", alignItems:"center" }}>{arr[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardSt}>
            {secTit("ti-file-description", "Contract Terms")}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["Type of Contract", (C2.typeOfContract||[]).map(function(v){return ({inhouse:"In-house",jv:"JV",tender:"Tender",lump_sum:"Lump Sum",others:"Others"}[v]||v);}).join(", ")||"—"],
                ["Payment Term",     (C2.paymentTerm||[]).map(function(v){return ({monthly_progress:"Monthly Progress",scheduled:"Scheduled",architect_certificate:"Architect Certificate"}[v]||v);}).join(", ")||"—"],
              ].map(function(arr) {
                return (
                  <div key={arr[0]}>
                    {fLabel(arr[0])}
                    <div style={{ height:34, border:"1px solid "+C.border, borderRadius:6,
                      padding:"0 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
                      display:"flex", alignItems:"center" }}>{arr[1]}</div>
                  </div>
                );
              })}
            </div>
            {C2.remarks && (
              <div style={{ marginTop:12 }}>
                {fLabel("Remarks")}
                <div style={{ border:"1px solid "+C.border, borderRadius:6,
                  padding:"8px 10px", fontSize:13, color:C.textSec, background:"#f8fafc",
                  lineHeight:1.5 }}>{C2.remarks}</div>
              </div>
            )}
          </div>

          {canAct && !confirmed && (
            <div style={cardSt}>
              {secTit("ti-checklist", "Setup Checklist")}
              <div style={{ fontSize:12, color:C.textSec, marginBottom:14 }}>
                Verify the following before marking setup as complete:
              </div>
              {[
                "Oracle project code created and activated",
                "Sub-project codes set up in Oracle",
                "Access permissions configured for assigned team members",
                "Email notification to be sent to section heads and secretaries",
              ].map(function(item, i) {
                return (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8,
                    padding:"7px 0", borderBottom:"1px solid #f8fafc", fontSize:13, color:C.textPri }}>
                    <i className="ti ti-square-check" style={{ fontSize:16, color:C.navy, flexShrink:0, marginTop:1 }} aria-hidden="true" />
                    {item}
                  </div>
                );
              })}
              <div style={{ marginTop:16 }}>
                <label style={{ fontSize:12, fontWeight:500, color:C.textSec, marginBottom:6, display:"block" }}>
                  Setup Notes (optional)
                </label>
                <textarea value={notes} onChange={function(e){setNotes(e.target.value);}}
                  placeholder="Any notes on the setup, special configurations, or exceptions…"
                  rows={3}
                  style={{ width:"100%", border:"1px solid "+C.border, borderRadius:6,
                    padding:"8px 10px", fontSize:12, fontFamily:"inherit", resize:"vertical",
                    background:"#fff", color:C.textPri, boxSizing:"border-box" }} />
              </div>
            </div>
          )}

          {canAct && !confirmed && (
            <div style={cardSt}>
              <div style={{ fontSize:15, fontWeight:600, color:C.textPri, marginBottom:14,
                paddingBottom:10, borderBottom:"1px solid #f1f5f9",
                display:"flex", alignItems:"center", gap:8 }}>
                <i className="ti ti-check" style={{ color:C.navy, fontSize:16 }} aria-hidden="true" />
                Mark Setup Complete
              </div>
              <div style={{ fontSize:12, color:C.textSec, marginBottom:14 }}>
                Confirming setup will set the project status to <strong>Issued</strong> and trigger email notification to all section heads and secretaries.
              </div>
              <button onClick={handleConfirm}
                style={{ display:"flex", alignItems:"center", gap:6, background:C.success, color:"#fff",
                  border:"none", borderRadius:6, padding:"0 24px", height:40,
                  fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
                Confirm Setup Complete
              </button>
            </div>
          )}
        </div>

        <div style={{ position:"sticky", top:0 }}>
          <div style={{ background:"#fff", border:"1px solid "+C.border, borderRadius:8, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.textSec, textTransform:"uppercase",
              letterSpacing:"0.04em", marginBottom:12 }}>Project Summary</div>
            {[
              { label:"Site Code",  value:project.siteCode, mono:true },
              { label:"Short Name", value:project.shortName },
              { label:"PIC",        value:(getUser(project.assignedRoles&&project.assignedRoles.pic)||{}).name||"—" },
              { label:"SIC",        value:(getUser(project.assignedRoles&&project.assignedRoles.sic)||{}).name||"—" },
            ].map(function(item) {
              return (
                <div key={item.label} style={{ paddingBottom:6, marginBottom:6, borderBottom:"1px solid #f8fafc" }}>
                  <div style={{ fontSize:11, color:C.textDis, fontWeight:500 }}>{item.label}</div>
                  <div style={{ fontSize:13, color:C.textPri, fontWeight:500,
                    fontFamily:item.mono?"'SF Mono',Consolas,monospace":"inherit" }}>{item.value||"—"}</div>
                </div>
              );
            })}
            {project.sectionD && project.sectionD.financeProjectCode && (
              <div style={{ margin:"8px 0", padding:"8px 10px", background:"#eff6ff",
                border:"1px solid #bfdbfe", borderRadius:6 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#1e40af", marginBottom:3 }}>Finance Project Code</div>
                <div style={{ fontSize:13, fontFamily:"'SF Mono',Consolas,monospace", color:"#1e40af", fontWeight:600 }}>
                  {project.sectionD.financeProjectCode}
                </div>
                {project.sectionD.subCodes && project.sectionD.subCodes.length>0 && (
                  <div style={{ fontSize:11, color:"#3b82f6", marginTop:3 }}>{project.sectionD.subCodes.length} sub-code{project.sectionD.subCodes.length>1?"s":""}</div>
                )}
              </div>
            )}
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase",
                letterSpacing:"0.04em", marginBottom:8 }}>Post-Approval Tasks</div>
              {[
                { label:"Finance Codes", done: project.postApprovalTasks&&project.postApprovalTasks.financeCodesStatus==="assigned" },
                { label:"IT System Setup", done: (project.postApprovalTasks&&project.postApprovalTasks.itSetupStatus==="complete")||confirmed },
              ].map(function(t) {
                return (
                  <div key={t.label} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", fontSize:12 }}>
                    <i className={"ti "+(t.done?"ti-circle-check":"ti-circle-dashed")}
                      style={{ fontSize:14, color:t.done?C.success:C.textDis, flexShrink:0 }} aria-hidden="true" />
                    <span style={{ color:t.done?C.success:C.textDis }}>{t.label}</span>
                  </div>
                );
              })}
            </div>
            <Stepper currentStage={confirmed?"complete":project.stage} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 9: Revision Diff View ─────────────────────────────────────────

// Human-readable labels for changedField keys
const DIFF_FIELD_LABELS = {
  "sectionB.mainContractor":    "Main Contractor",
  "sectionB.contractorLicence": "Contractor Licence No.",
  "sectionB.siteAreaSM":        "Site Area (m²)",
  "sectionB.gfaSM":             "Gross Floor Area (m²)",
  "sectionB.domesticGfaSM":     "Domestic GFA (m²)",
  "sectionB.nonDomesticGfaSM":  "Non-Domestic GFA (m²)",
  "sectionB.constructionFloorAreaSM": "Construction Floor Area (m²)",
  "sectionB.residentialUnits":  "Residential Units",
  "sectionB.noOfBlocksStorey":  "No. of Blocks & Storeys",
  "sectionB.developer":         "Developer",
  "sectionB.designArchitect":   "Design Architect",
  "sectionB.meConsultant":      "M&E Consultant",
  "sectionB.landscapeConsultant": "Landscape Consultant",
  "sectionB.interiorDesigner":  "Interior Designer",
  "sectionB.sustainabilityConsultant": "Sustainability Consultant",
  "sectionB.qsConsultant":      "QS Consultant",
  "sectionB.estateManagement":  "Estate Management",
  "sectionB.defectLiabilityPeriod": "Defect Liability Period",
  "sectionB.projectPhasing":    "Project Phasing",
  "sectionB.beamPlus.target":   "BeamPlus Rating (Target)",
  "sectionB.beamPlus.actual":   "BeamPlus Rating (Actual)",
  "sectionB.technicalDirector.name":   "Technical Director (BDTD)",
  "sectionB.authorisedSignatory.name": "Authorised Signatory (BDAS)",
  "sectionB.rse.name":          "Structural Consultant (BDRSE)",
  "sectionB.rge.name":          "Geotechnical Consultant (BDRGE)",
  "sectionB.cpm.name":          "CPM Name",
  "sectionB.cpm.email":         "CPM Email",
  "sectionB.costControlLeaders.accountingManager": "Cost Control — Accounting Manager",
  "sectionB.costControlLeaders.qsManager":         "Cost Control — QS Manager",
  "sectionB.costControlLeaders.contractsManager":  "Cost Control — Contracts Manager",
  "sectionB.dates.commencement.target":              "Commencement Date (Target)",
  "sectionB.dates.commencement.actual":              "Commencement Date (Actual)",
  "sectionB.dates.siteFormationCommencement.target": "Site Formation Commencement (Target)",
  "sectionB.dates.siteFormationCommencement.actual": "Site Formation Commencement (Actual)",
  "sectionB.dates.capCommencement.target":           "Cap Commencement (Target)",
  "sectionB.dates.capCommencement.actual":           "Cap Commencement (Actual)",
  "sectionB.dates.occupationPermit.target":          "OP Date (Target)",
  "sectionB.dates.occupationPermit.actual":          "OP Date (Actual)",
  "sectionB.dates.phasedOccupationPermit.target":    "Phased OP (Target)",
  "sectionB.dates.phasedOccupationPermit.actual":    "Phased OP (Actual)",
  "sectionB.dates.practicalCompletion.target":       "Practical Completion (Target)",
  "sectionB.dates.practicalCompletion.actual":       "Practical Completion (Actual)",
  "sectionB.dates.sectionalCompletion.target":       "Sectional Completion (Target)",
  "sectionB.dates.sectionalCompletion.actual":       "Sectional Completion (Actual)",
  "sectionB.dates.consentToAssign.target":           "Consent to Assign (Target)",
  "sectionB.dates.consentToAssign.actual":           "Consent to Assign (Actual)",
  "sectionB.dates.certificateOfCompliance.target":   "Certificate of Compliance (Target)",
  "sectionB.dates.certificateOfCompliance.actual":   "Certificate of Compliance (Actual)",
  "sectionB.dates.buildingCovenant.target":          "Building Covenant (Target)",
  "sectionB.dates.buildingCovenant.actual":          "Building Covenant (Actual)",
  "sectionC.typeOfContract":  "Type of Contract",
  "sectionC.paymentTerm":     "Payment Term",
  "sectionC.remarks":         "Contract Remarks",
  "role.pic":                 "PIC Assignment",
  "role.sic":                 "SIC Assignment",
};

const CONTRACT_LABELS = {
  inhouse:"In-house (Internal)", jv:"JV (External)",
  tender:"Tender", lump_sum:"Lump Sum", others:"Others",
};
const PAYMENT_LABELS = {
  monthly_progress:"Monthly Progress Payment",
  scheduled:"Scheduled Payment",
  architect_certificate:"Architect Certificate",
};

function formatDiffValue(key, raw) {
  if (!raw || raw === "—") return "—";
  if (key === "sectionC.typeOfContract")
    return raw.split(",").map(v => CONTRACT_LABELS[v.trim()] || v).join(", ");
  if (key === "sectionC.paymentTerm")
    return raw.split(",").map(v => PAYMENT_LABELS[v.trim()] || v).join(", ");
  // ISO date → readable
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return fmtDate(raw);
  return raw;
}

function RevisionDiffView({ currentUser, project, onBack }) {
  const rev = (project.revisions || []).find(r => r.status === "in_progress");
  const loc = getLoc(project.locationUUID);

  const cardSt = {
    background:"#fff", border:`1px solid ${C.border}`,
    borderRadius:8, padding:24, marginBottom:16,
  };

  const triggeredByUser = rev ? getUser(rev.triggeredBy) : null;
  const changedEntries  = rev ? Object.entries(rev.changedFields || {}) : [];
  const hasChanges      = changedEntries.length > 0;

  // Which changed keys are Cost Account sensitive
  const caChangedKeys = changedEntries
    .filter(([k]) => CA_SENSITIVE_KEYS.has(k.split(".").slice(0,2).join(".")))
    .map(([k]) => k);

  return (
    <div style={{ padding:24 }}>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.textSec, marginBottom:16 }}>
        <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>All Projects</a>
        <span style={{ color:C.textDis }}>›</span>
        <span>{project.siteCode}</span>
        <span style={{ color:C.textDis }}>›</span>
        <a onClick={onBack} style={{ color:C.midBlue, cursor:"pointer" }}>Approval View</a>
        <span style={{ color:C.textDis }}>›</span>
        <span>Revision {rev?.revisionNo} — Changes</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:20, alignItems:"start" }}>
        <div>

          {/* Revision header card */}
          <div style={{ ...cardSt, borderLeft:`4px solid ${C.warning}` }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:16 }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:C.textPri, marginBottom:4 }}>
                  Revision {rev?.revisionNo} — Changes Summary
                </div>
                <div style={{ fontSize:12, color:C.textSec, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                  <span>
                    <i className="ti ti-user" style={{ fontSize:12, marginRight:3 }} aria-hidden="true" />
                    Initiated by <strong>{triggeredByUser?.name}</strong>
                    {triggeredByUser && <span style={{ color:C.textDis }}> ({ROLE_LABELS[triggeredByUser.role]})</span>}
                  </span>
                  <span>
                    <i className="ti ti-calendar" style={{ fontSize:12, marginRight:3 }} aria-hidden="true" />
                    {fmtDate(rev?.triggeredAt)}
                  </span>
                  <span style={{
                    fontSize:11, fontWeight:600,
                    background: project.status === "revision" ? "#fef9c3" : "#dcfce7",
                    color: project.status === "revision" ? "#92400e" : "#166534",
                    padding:"2px 8px", borderRadius:10,
                  }}>
                    {project.status === "revision" ? "In Progress" : "Approved"}
                  </span>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:11, color:C.textDis, marginBottom:2 }}>Fields changed</div>
                <div style={{ fontSize:24, fontWeight:700, color: hasChanges ? C.navy : C.textDis }}>
                  {changedEntries.length}
                </div>
              </div>
            </div>

            <div style={{ background:"#fafafa", borderRadius:6, padding:"10px 14px", fontSize:13, color:C.textPri, lineHeight:1.6 }}>
              <span style={{ fontSize:11, fontWeight:600, color:C.textSec, textTransform:"uppercase", letterSpacing:"0.04em", display:"block", marginBottom:4 }}>Summary of Changes</span>
              {rev?.reason}
            </div>

            {/* Cost Account impact notice */}
            {caChangedKeys.length > 0 && (
              <div style={{ display:"flex", gap:10, background:"#fff7ed",
                border:`1px solid #fed7aa`, borderRadius:6,
                padding:"10px 14px", marginTop:12, fontSize:12, color:"#7c2d12" }}>
                <i className="ti ti-building-bank" style={{ fontSize:16, color:"#c2410c", flexShrink:0, marginTop:1 }} aria-hidden="true" />
                <div>
                  <strong>Cost Account impact:</strong> This revision includes changes to Cost Account-sensitive fields
                  ({caChangedKeys.map(k => DIFF_FIELD_LABELS[k] || k).join(", ")}).
                  Finance code entry is suspended until GM re-approves.
                </div>
              </div>
            )}
          </div>

          {/* Diff table */}
          <div style={cardSt}>
            <div style={{ fontSize:15, fontWeight:600, color:C.textPri, marginBottom:16,
              paddingBottom:10, borderBottom:`1px solid #f1f5f9`,
              display:"flex", alignItems:"center", gap:8 }}>
              <i className="ti ti-arrows-diff" style={{ color:C.navy, fontSize:16 }} aria-hidden="true" />
              Field Changes
            </div>

            {!hasChanges ? (
              <div style={{ padding:"32px 0", textAlign:"center" }}>
                <i className="ti ti-edit" style={{ fontSize:28, color:C.textDis, display:"block", marginBottom:10 }} aria-hidden="true" />
                <div style={{ fontSize:14, fontWeight:500, color:C.textSec, marginBottom:4 }}>No field changes recorded yet</div>
                <div style={{ fontSize:12, color:C.textDis }}>
                  The Engineer is currently editing. Changes will appear here once submitted.
                </div>
              </div>
            ) : (
              <div>
                {/* Table header */}
                <div style={{
                  display:"grid", gridTemplateColumns:"200px 1fr 1fr",
                  gap:0, background:"#f8fafc",
                  border:`1px solid ${C.border}`, borderRadius:"6px 6px 0 0",
                  padding:"8px 12px",
                }}>
                  {["Field","Original Value","Revised Value"].map(h => (
                    <div key={h} style={{ fontSize:11, fontWeight:600, color:C.textSec,
                      textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</div>
                  ))}
                </div>

                {/* Diff rows */}
                {changedEntries.map(([key, { old: oldVal, new: newVal }], i) => {
                  const isCA = CA_SENSITIVE_KEYS.has(key.split(".").slice(0,2).join("."));
                  const isLast = i === changedEntries.length - 1;
                  return (
                    <div key={key} style={{
                      display:"grid", gridTemplateColumns:"200px 1fr 1fr",
                      gap:0,
                      border:`1px solid ${C.border}`,
                      borderTop:"none",
                      borderRadius: isLast ? "0 0 6px 6px" : 0,
                      background: isCA ? "#fff7ed" : "#fff",
                    }}>
                      {/* Field name */}
                      <div style={{
                        padding:"10px 12px",
                        borderRight:`1px solid ${C.border}`,
                        display:"flex", flexDirection:"column", gap:4,
                      }}>
                        <span style={{ fontSize:12, fontWeight:600, color:C.textPri }}>
                          {DIFF_FIELD_LABELS[key] || key}
                        </span>
                        {isCA && (
                          <span style={{
                            fontSize:10, fontWeight:700,
                            background:"#fff7ed", color:"#c2410c",
                            padding:"1px 6px", borderRadius:4,
                            border:"1px solid #fed7aa", alignSelf:"flex-start",
                          }}>COST ACCOUNT</span>
                        )}
                      </div>

                      {/* Old value */}
                      <div style={{
                        padding:"10px 12px",
                        borderRight:`1px solid ${C.border}`,
                        fontSize:13, color:C.textDis,
                        textDecoration:"line-through",
                        display:"flex", alignItems:"center",
                      }}>
                        {formatDiffValue(key, oldVal)}
                      </div>

                      {/* New value */}
                      <div style={{
                        padding:"10px 12px",
                        fontSize:13, fontWeight:600, color:"#166534",
                        display:"flex", alignItems:"center", gap:6,
                      }}>
                        <i className="ti ti-arrow-right" style={{ fontSize:12, color:"#86efac", flexShrink:0 }} aria-hidden="true" />
                        {formatDiffValue(key, newVal)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ position:"sticky", top:24 }}>
          <div style={{ ...cardSt, marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec,
              textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:12 }}>
              Project
            </div>
            {[
              { label:"Site Code",    value:project.siteCode, mono:true },
              { label:"Short Name",   value:project.shortName },
              { label:"Lot Ref.",     value:loc ? locPrimaryLabel(loc) : "—" },
              { label:"Current Stage",value: STAGE_LABEL[project.stage] },
              { label:"PIC",          value:getUser(project.assignedRoles?.pic)?.name || "—" },
              { label:"SIC",          value:getUser(project.assignedRoles?.sic)?.name || "—" },
              { label:"Engineer",     value:getUser(project.assignedRoles?.engineer)?.name || "—" },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ paddingBottom:6, marginBottom:6, borderBottom:"1px solid #f8fafc" }}>
                <div style={{ fontSize:11, color:C.textDis, fontWeight:500 }}>{label}</div>
                <div style={{ fontSize:13, color:C.textPri, fontWeight:500,
                  fontFamily:mono?"'SF Mono',Consolas,monospace":"inherit" }}>{value||"—"}</div>
              </div>
            ))}
            <div style={{ marginTop:8, padding:"8px 10px", background:"#fef9c3",
              border:"1px solid #fde68a", borderRadius:6 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#92400e" }}>
                <i className="ti ti-refresh" style={{ fontSize:12 }} aria-hidden="true" /> Revision in progress
              </div>
              <div style={{ fontSize:11, color:"#78350f", marginTop:2 }}>
                Re-approval required from all stages
              </div>
            </div>
          </div>

          {/* Approval chain progress */}
          <div style={cardSt}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textSec,
              textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:10 }}>
              Re-Approval Progress
            </div>
            {["engineer","qs_team_leader","qs_manager","sic","pic","gm"].map(stage => {
              const revApproved = (rev?.approvalHistory || []).some(h => h.stage === stage && h.action !== "returned");
              const isCurrent   = project.stage === stage;
              const isPending   = !revApproved && !isCurrent;
              return (
                <div key={stage} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0" }}>
                  <i className={`ti ${revApproved ? "ti-circle-check" : isCurrent ? "ti-circle-dot" : "ti-circle-dashed"}`}
                    style={{ fontSize:14, flexShrink:0,
                      color: revApproved ? C.success : isCurrent ? C.navy : C.textDis }} aria-hidden="true" />
                  <span style={{ fontSize:12,
                    color: revApproved ? C.success : isCurrent ? C.navy : C.textDis,
                    fontWeight: isCurrent ? 600 : 400 }}>
                    {STAGE_LABEL[stage]}
                  </span>
                  {isCurrent && (
                    <span style={{ fontSize:10, background:"#dbeafe", color:"#1e40af",
                      padding:"1px 6px", borderRadius:8, fontWeight:500 }}>Now</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 11: Reports ───────────────────────────────────────────────────

const REPORT_COLUMNS = [
  {
    group: "Project Info",
    cols: [
      { key:"siteCode",       label:"Site Code",      default:true,
        get: p => p.siteCode },
      { key:"fullName",       label:"Full Name",       default:true,
        get: p => p.fullName },
      { key:"shortName",      label:"Short Name",      default:false,
        get: p => p.shortName },
      { key:"stage",          label:"Current Stage",   default:true,
        get: p => STAGE_LABEL[p.stage] || p.stage },
      { key:"status",         label:"Status",          default:true,
        get: p => p.status === "revision" ? "Revision in Progress" : p.status === "approved" ? "System Setup" : p.stage === "complete" ? "Issued" : "In Approval" },
      { key:"nature",         label:"Nature",          default:true,
        get: p => (p.nature||[]).map(n => ({ residential:"Residential", retail:"Retail", office:"Office", industrial:"Industrial", hotel:"Hotel", data_centre:"Data Centre", aa_works:"A&A Works", others:"Others", mixed:"Mixed" }[n]||n)).join(", ") },
    ],
  },
  {
    group: "Location",
    cols: [
      { key:"lotRef",         label:"Lot Reference",   default:false,
        get: p => { const l = getLoc(p.locationUUID); return l ? locPrimaryLabel(l) : "—"; } },
      { key:"district",       label:"District",        default:false,
        get: p => { const l = getLoc(p.locationUUID); return l?.district || "—"; } },
      { key:"street",         label:"Street",          default:false,
        get: p => { const l = getLoc(p.locationUUID); return l?.streetNameNumber || "—"; } },
    ],
  },
  {
    group: "Project Team",
    cols: [
      { key:"pic",            label:"PIC",             default:true,
        get: p => getUser(p.assignedRoles?.pic)?.name || "—" },
      { key:"sic",            label:"SIC",             default:true,
        get: p => getUser(p.assignedRoles?.sic)?.name || "—" },
      { key:"engineer",       label:"Engineer",        default:false,
        get: p => getUser(p.assignedRoles?.engineer)?.name || "—" },
      { key:"mainContractor", label:"Main Contractor", default:true,
        get: p => p.sectionB?.mainContractor || "—" },
      { key:"developer",      label:"Developer",       default:false,
        get: p => p.sectionB?.developer || "—" },
    ],
  },
  {
    group: "Areas",
    cols: [
      { key:"gfaSM",          label:"GFA (m²)",        default:false,
        get: p => p.sectionB?.gfaSM || "—" },
      { key:"domesticGfaSM",  label:"Domestic GFA (m²)", default:false,
        get: p => p.sectionB?.domesticGfaSM || "—" },
    ],
  },
  {
    group: "Key Dates",
    cols: [
      { key:"opTarget",       label:"OP Date (Target)", default:true,
        get: p => fmtDate(p.sectionB?.dates?.occupationPermit?.target) || "—" },
      { key:"opActual",       label:"OP Date (Actual)", default:false,
        get: p => fmtDate(p.sectionB?.dates?.occupationPermit?.actual) || "—" },
      { key:"pcTarget",       label:"Practical Completion (Target)", default:true,
        get: p => fmtDate(p.sectionB?.dates?.practicalCompletion?.target) || "—" },
      { key:"pcActual",       label:"Practical Completion (Actual)", default:false,
        get: p => fmtDate(p.sectionB?.dates?.practicalCompletion?.actual) || "—" },
      { key:"cocTarget",      label:"Cert. of Compliance (Target)", default:false,
        get: p => fmtDate(p.sectionB?.dates?.certificateOfCompliance?.target) || "—" },
      { key:"commTarget",     label:"Commencement (Target)", default:false,
        get: p => fmtDate(p.sectionB?.dates?.commencement?.target) || "—" },
      { key:"beamPlus",       label:"BeamPlus (Target)", default:false,
        get: p => p.sectionB?.beamPlus?.target || "—" },
    ],
  },
  {
    group: "Contract",
    cols: [
      { key:"typeOfContract", label:"Type of Contract", default:false,
        get: p => (p.sectionC?.typeOfContract||[]).map(v => ({ inhouse:"In-house", jv:"JV", tender:"Tender", lump_sum:"Lump Sum", others:"Others" }[v]||v)).join(", ") || "—" },
      { key:"paymentTerm",    label:"Payment Term",     default:false,
        get: p => (p.sectionC?.paymentTerm||[]).map(v => ({ monthly_progress:"Monthly Progress", scheduled:"Scheduled", architect_certificate:"Architect Cert." }[v]||v)).join(", ") || "—" },
    ],
  },
  {
    group: "Finance",
    cols: [
      { key:"financeCode",    label:"Finance Project Code", default:true,
        get: p => p.sectionD?.financeProjectCode || "—" },
    ],
  },
];

// Flat list for easy lookup
const ALL_COLS = REPORT_COLUMNS.flatMap(g => g.cols);

const NATURE_OPTIONS = [
  { value:"residential", label:"Residential" },
  { value:"retail",      label:"Retail" },
  { value:"office",      label:"Office" },
  { value:"industrial",  label:"Industrial" },
  { value:"hotel",       label:"Hotel" },
  { value:"data_centre", label:"Data Centre" },
  { value:"aa_works",    label:"A&A Works" },
  { value:"others",      label:"Others" },
];

function ReportsScreen({ currentUser, projects }) {
  // Column visibility
  const [visibleCols, setVisibleCols] = useState(
    new Set(ALL_COLS.filter(c => c.default).map(c => c.key))
  );

  // Filters
  const [filterNature,   setFilterNature]   = useState(new Set());
  const [filterStage,    setFilterStage]    = useState(new Set());
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterOpFrom,   setFilterOpFrom]   = useState("");
  const [filterOpTo,     setFilterOpTo]     = useState("");
  const [myProjects,     setMyProjects]     = useState(false);

  // Sort
  const [sortKey, setSortKey] = useState("siteCode");
  const [sortAsc, setSortAsc] = useState(true);

  // Toast
  const [toast, setToast] = useState(false);

  function toggleCol(key) {
    setVisibleCols(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function toggleNature(v) {
    setFilterNature(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n; });
  }

  function toggleStageFilter(v) {
    setFilterStage(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n; });
  }

  function handleSort(key) {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  // Role-based project visibility
  const viewAllRoles = ["mo_secretary","gm","it","system_admin"];
  const visibleProjects = viewAllRoles.includes(currentUser.role)
    ? projects
    : projects.filter(p => {
        const r = p.assignedRoles || {};
        return Object.values(r).includes(currentUser.uuid);
      });

  // Apply filters
  const filtered = visibleProjects.filter(p => {
    if (myProjects) {
      const r = p.assignedRoles || {};
      if (!Object.values(r).includes(currentUser.uuid)) return false;
    }
    if (filterNature.size > 0 && !(p.nature||[]).some(n => filterNature.has(n))) return false;
    if (filterStage.size  > 0 && !filterStage.has(p.stage)) return false;
    if (filterDistrict.trim()) {
      const l = getLoc(p.locationUUID);
      if (!l?.district?.toLowerCase().includes(filterDistrict.toLowerCase())) return false;
    }
    if (filterOpFrom || filterOpTo) {
      const op = p.sectionB?.dates?.occupationPermit?.target;
      if (!op) return false;
      if (filterOpFrom && op < filterOpFrom) return false;
      if (filterOpTo   && op > filterOpTo)   return false;
    }
    return true;
  });

  // Sort
  const colDef = ALL_COLS.find(c => c.key === sortKey);
  const sorted = [...filtered].sort((a, b) => {
    const av = colDef ? colDef.get(a) : "";
    const bv = colDef ? colDef.get(b) : "";
    const cmp = (av || "").localeCompare(bv || "");
    return sortAsc ? cmp : -cmp;
  });

  // Ordered visible columns
  const orderedCols = ALL_COLS.filter(c => visibleCols.has(c.key));

  function handleExport() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  const inputSt = {
    height:30, border:`1px solid ${C.border}`, borderRadius:5,
    padding:"0 8px", fontSize:12, fontFamily:"inherit",
    color:C.textPri, width:"100%", boxSizing:"border-box",
  };
  const checkSt = { cursor:"pointer", accentColor:C.navy };

  return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:0, minHeight:0 }}>
      {/* Page header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:C.textPri }}>Reports</h2>
          <div style={{ fontSize:12, color:C.textSec, marginTop:2 }}>
            Viewing {sorted.length} of {visibleProjects.length} project{visibleProjects.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12,
            color:C.textSec, cursor:"pointer" }}>
            <input type="checkbox" checked={myProjects}
              onChange={e => setMyProjects(e.target.checked)}
              style={checkSt} />
            Show only my projects
          </label>
          <button onClick={handleExport} style={{
            display:"flex", alignItems:"center", gap:6,
            background:C.navy, color:"#fff", border:"none",
            borderRadius:6, padding:"0 16px", height:34,
            fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit",
          }}>
            <i className="ti ti-file-spreadsheet" style={{ fontSize:15 }} aria-hidden="true" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:9999,
          background:C.navy, color:"#fff", borderRadius:8,
          padding:"12px 20px", fontSize:13, fontWeight:500,
          display:"flex", alignItems:"center", gap:8,
          boxShadow:"0 4px 16px rgba(0,0,0,0.18)",
        }}>
          <i className="ti ti-circle-check" style={{ fontSize:16 }} aria-hidden="true" />
          Export ready — {sorted.length} project{sorted.length !== 1 ? "s" : ""} exported.
        </div>
      )}

      <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>

        {/* ── Left panel: columns + filters ── */}
        <div style={{
          width:240, flexShrink:0,
          background:"#fff", border:`1px solid ${C.border}`,
          borderRadius:8, padding:16,
          maxHeight:"calc(100vh - 160px)", overflowY:"auto",
        }}>

          {/* Column selector */}
          <div style={{ fontSize:11, fontWeight:700, color:C.textSec,
            textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>
            Columns
          </div>
          {REPORT_COLUMNS.map(group => (
            <div key={group.group} style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textPri,
                marginBottom:5, paddingBottom:4,
                borderBottom:`1px solid #f1f5f9` }}>
                {group.group}
              </div>
              {group.cols.map(col => (
                <label key={col.key} style={{ display:"flex", alignItems:"center", gap:7,
                  fontSize:12, color:C.textSec, cursor:"pointer",
                  padding:"3px 0" }}>
                  <input type="checkbox"
                    checked={visibleCols.has(col.key)}
                    onChange={() => toggleCol(col.key)}
                    style={checkSt} />
                  {col.label}
                </label>
              ))}
            </div>
          ))}

          {/* Divider */}
          <div style={{ borderTop:`1px solid ${C.border}`, margin:"12px 0" }} />

          {/* Filters */}
          <div style={{ fontSize:11, fontWeight:700, color:C.textSec,
            textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>
            Filters
          </div>

          {/* Nature */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textPri, marginBottom:5 }}>Nature</div>
            {NATURE_OPTIONS.map(opt => (
              <label key={opt.value} style={{ display:"flex", alignItems:"center", gap:7,
                fontSize:12, color:C.textSec, cursor:"pointer", padding:"2px 0" }}>
                <input type="checkbox"
                  checked={filterNature.has(opt.value)}
                  onChange={() => toggleNature(opt.value)}
                  style={checkSt} />
                {opt.label}
              </label>
            ))}
          </div>

          {/* Stage */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textPri, marginBottom:5 }}>Current Stage</div>
            {STAGE_ORDER.map(s => (
              <label key={s} style={{ display:"flex", alignItems:"center", gap:7,
                fontSize:12, color:C.textSec, cursor:"pointer", padding:"2px 0" }}>
                <input type="checkbox"
                  checked={filterStage.has(s)}
                  onChange={() => toggleStageFilter(s)}
                  style={checkSt} />
                {STAGE_LABEL[s]}
              </label>
            ))}
          </div>

          {/* District */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textPri, marginBottom:5 }}>District</div>
            <input
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
              placeholder="Filter by district…"
              style={inputSt}
            />
          </div>

          {/* OP Date range */}
          <div style={{ marginBottom:4 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textPri, marginBottom:5 }}>OP Date Range</div>
            <div style={{ fontSize:11, color:C.textDis, marginBottom:4 }}>From</div>
            <input type="date" value={filterOpFrom}
              onChange={e => setFilterOpFrom(e.target.value)}
              style={{ ...inputSt, marginBottom:6 }} />
            <div style={{ fontSize:11, color:C.textDis, marginBottom:4 }}>To</div>
            <input type="date" value={filterOpTo}
              onChange={e => setFilterOpTo(e.target.value)}
              style={inputSt} />
          </div>

          {/* Clear filters */}
          {(filterNature.size > 0 || filterStage.size > 0 || filterDistrict || filterOpFrom || filterOpTo || myProjects) && (
            <button onClick={() => {
              setFilterNature(new Set()); setFilterStage(new Set());
              setFilterDistrict(""); setFilterOpFrom(""); setFilterOpTo("");
              setMyProjects(false);
            }} style={{
              marginTop:12, width:"100%", fontSize:12, color:C.danger,
              background:"none", border:`1px solid #fca5a5`, borderRadius:5,
              padding:"5px 0", cursor:"pointer", fontFamily:"inherit",
            }}>
              Clear all filters
            </button>
          )}
        </div>

        {/* ── Right panel: results table ── */}
        <div style={{ flex:1, minWidth:0 }}>
          {sorted.length === 0 ? (
            <div style={{ background:"#fff", border:`1px solid ${C.border}`,
              borderRadius:8, padding:"48px 24px", textAlign:"center" }}>
              <i className="ti ti-search-off" style={{ fontSize:28, color:C.textDis,
                display:"block", marginBottom:10 }} aria-hidden="true" />
              <div style={{ fontSize:14, fontWeight:500, color:C.textSec }}>
                No projects match the current filters.
              </div>
            </div>
          ) : (
            <div style={{ background:"#fff", border:`1px solid ${C.border}`,
              borderRadius:8, overflow:"hidden" }}>
              {/* Table */}
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse",
                  fontSize:12, tableLayout:"auto" }}>
                  <thead>
                    <tr style={{ background:"#f8fafc", borderBottom:`2px solid ${C.border}` }}>
                      {orderedCols.map(col => (
                        <th key={col.key}
                          onClick={() => handleSort(col.key)}
                          style={{
                            padding:"9px 12px", textAlign:"left",
                            fontSize:11, fontWeight:600, color:C.textSec,
                            textTransform:"uppercase", letterSpacing:"0.04em",
                            cursor:"pointer", userSelect:"none", whiteSpace:"nowrap",
                            borderRight:`1px solid ${C.border}`,
                          }}>
                          {col.label}
                          {sortKey === col.key && (
                            <i className={`ti ${sortAsc ? "ti-chevron-up" : "ti-chevron-down"}`}
                              style={{ fontSize:11, marginLeft:4 }} aria-hidden="true" />
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((p, i) => (
                      <tr key={p.uuid} style={{
                        borderBottom:`1px solid ${C.border}`,
                        background: i % 2 === 0 ? "#fff" : "#fafafa",
                      }}>
                        {orderedCols.map(col => (
                          <td key={col.key} style={{
                            padding:"8px 12px", color:C.textPri,
                            borderRight:`1px solid ${C.border}`,
                            whiteSpace: col.key === "fullName" ? "normal" : "nowrap",
                            fontFamily: col.key === "siteCode" || col.key === "financeCode"
                              ? "'SF Mono',Consolas,monospace" : "inherit",
                          }}>
                            {col.key === "status" ? (
                              <StatusBadge stage={p.stage} status={p.status} />
                            ) : col.get(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Footer row count */}
              <div style={{ padding:"8px 14px", borderTop:`1px solid ${C.border}`,
                fontSize:11, color:C.textSec, background:"#f8fafc" }}>
                Showing {sorted.length} of {visibleProjects.length} project{visibleProjects.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [screen, setScreen] = useState("list");
  const [activeProject, setActiveProject] = useState(null);
  const [navKey, setNavKey] = useState("sites");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  function handleToggleSidebar() {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem("pdp_sidebar_collapsed", String(next)); } catch {}
      return next;
    });
  }

  function handleRevisionStarted(updated) {
    setProjects(prev => prev.map(p => p.uuid === updated.uuid ? updated : p));
    setActiveProject(updated);
    // Navigate back to appropriate entry screen for the revision initiator
    const stageToScreen = {
      engineer: "entry",
      sic: "approval",
      qs_team_leader: "approval",
    };
    setScreen(stageToScreen[updated.stage] || "entry");
  }

  function handleSwitchUser(uuid) {
    setCurrentUser(USERS.find(u => u.uuid === uuid));
  }

  function handleOpenProject(uuid) {
    const p = projects.find(x => x.uuid === uuid);
    if (!p) return;
    setActiveProject(p);
    setNavKey("sites");

    // MO Secretary always sees Section A — they can edit identifiers at any stage
    if (currentUser.role === "mo_secretary") {
      setScreen("sectionA");
      return;
    }

    // PIC and QS Manager go to sectionA (unified delegation view)
    if (currentUser.role === "pic" || currentUser.uuid === p.assignedRoles?.pic ||
        currentUser.role === "qs_manager" || currentUser.uuid === p.assignedRoles?.qsManager) {
      // Only route to sectionA during delegation stage or if they need to assign
      if (["mo_secretary","delegation"].includes(p.stage)) {
        setScreen("sectionA");
        return;
      }
    }

    // Cost Account can draft finance codes at any point before GM approval
    const phase1Stages = ["mo_secretary","delegation","engineer","qs_team_leader","qs_manager","sic","pic","gm"];
    if (currentUser.role === "cost_account" && phase1Stages.includes(p.stage)) {
      setScreen("costAccount");
      return;
    }

    if (p.stage === "mo_secretary") {
      setScreen("sectionA");
    } else if (p.stage === "delegation") {
      setScreen("delegation");
    } else if (p.stage === "engineer" && p.status !== "revision") {
      setScreen("entry");
    } else if (p.stage === "engineer" && p.status === "revision") {
      setScreen("entry");
    } else if (["qs_team_leader","qs_manager","sic","pic","gm"].includes(p.stage)) {
      setScreen("approval");
    } else if (p.stage === "cost_account") {
      setScreen("costAccount");
    } else if (p.stage === "it") {
      setScreen("it");
    } else if (p.stage === "complete") {
      setScreen("approval");
    } else {
      setScreen("sectionA");
    }
  }

  function handleNewProject() {
    const blank = {
      uuid: `uuid-new-${Date.now()}`,
      siteCode:"", fullName:"", shortName:"", estateName:"", estateNameTBC:false,
      locationUUID:null, leasePlanURL:null,
      stage:"mo_secretary", status:"in_progress",
      nature:["residential"],
      assignedRoles:{ pic:"", sic:"", engineer:"", qsManager:"", qsTeamLeader:"", costAccount:"" },
      updatedAt:new Date().toISOString(), createdAt:new Date().toISOString(),
    };
    setActiveProject(blank);
    setScreen("sectionA");
  }

  function handleApprovalUpdated(updated) {
    setProjects(prev => prev.map(p => p.uuid === updated.uuid ? updated : p));
    setActiveProject(updated);
    // Auto-navigate to cost_account screen after GM approval
    if (updated.stage === "cost_account") setScreen("costAccount");
  }

  function handleEntryUpdated(updated) {
    setProjects(prev => prev.map(p => p.uuid === updated.uuid ? updated : p));
    setActiveProject(updated);
  }

  function handleDelegationUpdated(updated) {
    setProjects(prev => prev.map(p => p.uuid === updated.uuid ? updated : p));
    setActiveProject(updated);
  }

  function handleSubmitted(updated) {
    setProjects(prev => {
      const exists = prev.find(p => p.uuid === updated.uuid);
      if (exists) return prev.map(p => p.uuid === updated.uuid ? updated : p);
      return [updated, ...prev];
    });
    setActiveProject(updated);
    // Stay on sectionA — MO Sec, PIC, QSM all work from this unified screen
    setScreen("sectionA");
  }

  function handleNav(key) {
    setNavKey(key);
    if (key === "sites")   { setScreen("list");    setActiveProject(null); }
    if (key === "reports") { setScreen("reports");  setActiveProject(null); }
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", minHeight:700, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:C.page, color:C.textPri, fontSize:14 }}>
      <Navbar currentUser={currentUser} onSwitchUser={handleSwitchUser} notifications={NOTIFICATIONS} />
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <Sidebar currentUser={currentUser} activeKey={navKey} onNav={handleNav}
          collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
        <main style={{ flex:1, overflowY:"auto" }}>
          {screen === "list" && (
            <ProjectList
              currentUser={currentUser}
              projects={projects}
              onOpen={handleOpenProject}
              onNewProject={handleNewProject}
            />
          )}
          {screen === "sectionA" && activeProject && (
            <SectionA
              currentUser={currentUser}
              project={activeProject}
              onBack={() => { setScreen("list"); setActiveProject(null); }}
              onSubmitted={handleSubmitted}
            />
          )}
          {screen === "delegation" && activeProject && (
            <DelegationView
              currentUser={currentUser}
              project={activeProject}
              onBack={() => { setScreen("list"); setActiveProject(null); }}
              onUpdated={handleDelegationUpdated}
            />
          )}
          {screen === "entry" && activeProject && (
            <EngineerQSEntry
              currentUser={currentUser}
              project={activeProject}
              onBack={() => { setScreen("list"); setActiveProject(null); }}
              onInitiateRevision={() => setScreen("revisionInitiation")}
              onUpdated={handleEntryUpdated}
              onEditAssignments={() => setScreen("delegation")}
            />
          )}
          {screen === "approval" && activeProject && (
            <ApprovalView
              currentUser={currentUser}
              project={activeProject}
              onBack={() => { setScreen("list"); setActiveProject(null); }}
              onUpdated={handleApprovalUpdated}
              readOnly={activeProject.stage === "complete"}
              onInitiateRevision={() => setScreen("revisionInitiation")}
              onEditAssignments={() => setScreen("delegation")}
            />
          )}
          {screen === "costAccount" && activeProject && (
            <CostAccountView
              currentUser={currentUser}
              project={activeProject}
              onBack={() => { setScreen("list"); setActiveProject(null); }}
              onInitiateRevision={() => setScreen("revisionInitiation")}
              onUpdated={(updated) => {
                setProjects(prev => prev.map(p => p.uuid === updated.uuid ? updated : p));
                setActiveProject(updated);
                if (updated.stage === "it") setScreen("it");
              }}
            />
          )}
          {screen === "it" && activeProject && (
            <ITView
              currentUser={currentUser}
              project={activeProject}
              onBack={() => { setScreen("list"); setActiveProject(null); }}
              onInitiateRevision={() => setScreen("revisionInitiation")}
              onUpdated={(updated) => {
                setProjects(prev => prev.map(p => p.uuid === updated.uuid ? updated : p));
                setActiveProject(updated);
              }}
            />
          )}
          {screen === "revisionInitiation" && activeProject && (
            <RevisionInitiation
              currentUser={currentUser}
              project={activeProject}
              onBack={() => { setScreen("list"); setActiveProject(null); }}
              onRevisionStarted={handleRevisionStarted}
            />
          )}
          {screen === "reports" && (
            <ReportsScreen
              currentUser={currentUser}
              projects={projects}
            />
          )}
        </main>
      </div>
    </div>
  );
}
